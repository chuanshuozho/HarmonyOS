import { promptAction } from '@kit.ArkUI';
import { AppSnapshot, AutomationRule, DeviceState, EngineResult, Environment, ExecutionLog,
  RuleCondition, defaultSnapshot, deviceLabel, fieldLabel } from '../models/Models';
import { RuleEngine } from '../engine/RuleEngine';
import { SnapshotRepository } from '../data/SnapshotRepository';

const BG: string = '#F5F7FB';
const BLUE: string = '#3559E0';
const INK: string = '#17233C';
const MUTED: string = '#65728B';

@Entry
@Component
struct Index {
  @State activeTab: number = 0;
  @State temperature: number = 25;
  @State humidity: number = 55;
  @State lux: number = 550;
  @State devices: DeviceState[] = [];
  @State rules: AutomationRule[] = [];
  @State logs: ExecutionLog[] = [];
  @State nextRuleId: number = 5;
  @State banner: string = '请选择模拟场景或滑动环境参数';
  @State editingId: string = '';
  @State editorOpen: boolean = false;
  @State nameInput: string = '';
  @State priorityInput: string = '50';
  @State firstField: string = 'temperature';
  @State firstOperator: string = '>=';
  @State firstValueInput: string = '28';
  @State twoConditions: boolean = false;
  @State secondField: string = 'humidity';
  @State secondOperator: string = '>=';
  @State secondValueInput: string = '70';
  @State selectedDevice: string = 'FAN';
  @State selectedAction: string = 'ON';

  private repository: SnapshotRepository | null = null;

  aboutToAppear(): void {
    try {
      this.repository = new SnapshotRepository(getContext(this) as Context);
      let snapshot: AppSnapshot = this.repository.load();
      this.temperature = snapshot.environment.temperature;
      this.humidity = snapshot.environment.humidity;
      this.lux = snapshot.environment.lux;
      this.devices = snapshot.devices;
      this.rules = snapshot.rules;
      this.logs = snapshot.logs;
      this.nextRuleId = snapshot.nextRuleId;
      this.banner = '本地数据已载入，可继续编辑并演练';
    } catch (err) {
      let backup: AppSnapshot = defaultSnapshot();
      this.temperature = backup.environment.temperature;
      this.humidity = backup.environment.humidity;
      this.lux = backup.environment.lux;
      this.devices = backup.devices;
      this.rules = backup.rules;
      this.logs = backup.logs;
      this.nextRuleId = backup.nextRuleId;
      this.banner = '无法读取本地存档，已加载默认数据';
    }
  }

  private currentEnvironment(): Environment {
    return { temperature: this.temperature, humidity: this.humidity, lux: this.lux };
  }

  private currentSnapshot(): AppSnapshot {
    return {
      version: 1,
      environment: this.currentEnvironment(),
      devices: this.devices,
      rules: this.rules,
      logs: this.logs,
      nextRuleId: this.nextRuleId
    };
  }

  private async persist(): Promise<void> {
    if (this.repository === null) { return; }
    try {
      await this.repository.save(this.currentSnapshot());
    } catch (err) {
      this.banner = '保存失败，请检查设备存储状态';
      promptAction.showToast({ message: this.banner });
    }
  }

  private useScene(scene: number): void {
    if (scene === 0) {
      this.temperature = 33;
      this.humidity = 82;
      this.lux = 900;
      this.banner = '已加载「盛夏午后」：33℃ / 82% / 900lx';
    } else {
      this.temperature = 18;
      this.humidity = 48;
      this.lux = 80;
      this.banner = '已加载「夜间降温」：18℃ / 48% / 80lx';
    }
    this.persist();
  }

  private toggleDevice(id: string): void {
    let next: DeviceState[] = [];
    for (let i: number = 0; i < this.devices.length; i++) {
      let item: DeviceState = this.devices[i];
      next.push({ id: item.id, name: item.name, on: item.id === id ? !item.on : item.on });
    }
    this.devices = next;
    this.banner = deviceLabel(id) + '已手动切换；下次演练仍会按规则重新控制';
    this.persist();
  }

  private execute(): void {
    try {
      let result: EngineResult = RuleEngine.evaluate(this.currentEnvironment(), this.rules, this.devices, Date.now());
      this.devices = result.devices;
      this.logs = this.logs.concat(result.logs).slice(-100);
      this.banner = '演练完成：命中 ' + result.matchedCount.toString() + ' 条规则；新增 ' +
        result.logs.length.toString() + ' 条执行记录';
      this.persist();
      promptAction.showToast({ message: '规则演练完成' });
    } catch (err) {
      this.banner = '演练失败：环境数据或规则配置无效';
      promptAction.showToast({ message: this.banner });
    }
  }

  private flipRuleEnabled(id: string): void {
    let next: AutomationRule[] = [];
    for (let i: number = 0; i < this.rules.length; i++) {
      let rule: AutomationRule = this.rules[i];
      if (rule.id === id) {
        next.push({ id: rule.id, name: rule.name, enabled: !rule.enabled, priority: rule.priority,
          conditions: rule.conditions, targetDevice: rule.targetDevice, action: rule.action });
      } else { next.push(rule); }
    }
    this.rules = next;
    this.banner = '规则启用状态已更新';
    this.persist();
  }

  private startNewRule(): void {
    this.editingId = '';
    this.nameInput = '';
    this.priorityInput = '50';
    this.firstField = 'temperature';
    this.firstOperator = '>=';
    this.firstValueInput = '28';
    this.twoConditions = false;
    this.secondField = 'humidity';
    this.secondOperator = '>=';
    this.secondValueInput = '70';
    this.selectedDevice = 'FAN';
    this.selectedAction = 'ON';
    this.editorOpen = true;
  }

  private editRule(rule: AutomationRule): void {
    this.editingId = rule.id;
    this.nameInput = rule.name;
    this.priorityInput = rule.priority.toString();
    this.firstField = rule.conditions[0].field;
    this.firstOperator = rule.conditions[0].operator;
    this.firstValueInput = rule.conditions[0].value.toString();
    this.twoConditions = rule.conditions.length === 2;
    if (rule.conditions.length === 2) {
      this.secondField = rule.conditions[1].field;
      this.secondOperator = rule.conditions[1].operator;
      this.secondValueInput = rule.conditions[1].value.toString();
    } else {
      this.secondField = 'humidity';
      this.secondOperator = '>=';
      this.secondValueInput = '70';
    }
    this.selectedDevice = rule.targetDevice;
    this.selectedAction = rule.action;
    this.editorOpen = true;
  }

  private cycleField(current: string): string {
    if (current === 'temperature') { return 'humidity'; }
    if (current === 'humidity') { return 'lux'; }
    return 'temperature';
  }

  private cycleOperator(current: string): string {
    if (current === '>') { return '>='; }
    if (current === '>=') { return '<'; }
    if (current === '<') { return '<='; }
    if (current === '<=') { return '=='; }
    return '>';
  }

  private cycleDevice(current: string): string {
    if (current === 'LIGHT') { return 'FAN'; }
    if (current === 'FAN') { return 'AC'; }
    if (current === 'AC') { return 'CURTAIN'; }
    return 'LIGHT';
  }

  private saveRule(): void {
    if (this.nameInput.trim().length === 0 || this.firstValueInput.trim().length === 0 ||
      this.priorityInput.trim().length === 0 || (this.twoConditions && this.secondValueInput.trim().length === 0)) {
      promptAction.showToast({ message: '请完整填写规则名称和数值' });
      return;
    }
    let conditions: RuleCondition[] = [{
      field: this.firstField, operator: this.firstOperator, value: Number(this.firstValueInput)
    }];
    if (this.twoConditions) {
      conditions.push({ field: this.secondField, operator: this.secondOperator,
        value: Number(this.secondValueInput) });
    }
    let newId: string = this.editingId.length > 0 ? this.editingId : 'R' + this.nextRuleId.toString();
    let candidate: AutomationRule = {
      id: newId, name: this.nameInput.trim(), enabled: true,
      priority: Number(this.priorityInput), conditions: conditions,
      targetDevice: this.selectedDevice, action: this.selectedAction
    };
    if (this.editingId.length > 0) {
      for (let i: number = 0; i < this.rules.length; i++) {
        if (this.rules[i].id === this.editingId) {
          candidate.enabled = this.rules[i].enabled;
          break;
        }
      }
    }
    let message: string = RuleEngine.validateRule(candidate);
    if (message.length > 0) {
      this.banner = message;
      promptAction.showToast({ message: message });
      return;
    }
    let replaced: boolean = false;
    let next: AutomationRule[] = [];
    for (let i: number = 0; i < this.rules.length; i++) {
      if (this.rules[i].id === candidate.id) {
        next.push(candidate);
        replaced = true;
      } else { next.push(this.rules[i]); }
    }
    if (!replaced) {
      next.push(candidate);
      this.nextRuleId += 1;
    }
    this.rules = next;
    this.editorOpen = false;
    this.banner = replaced ? '规则修改成功，重新演练后生效' : '规则新增成功，重新演练后生效';
    this.persist();
  }

  private deleteRule(id: string): void {
    this.rules = this.rules.filter((rule: AutomationRule): boolean => rule.id !== id);
    this.banner = '规则已删除';
    this.persist();
  }

  @Builder
  private tabItem(index: number, caption: string) {
    Button(caption)
      .fontSize(14)
      .fontWeight(FontWeight.Medium)
      .fontColor(this.activeTab === index ? '#FFFFFF' : MUTED)
      .backgroundColor(this.activeTab === index ? BLUE : '#FFFFFF')
      .borderRadius(10)
      .layoutWeight(1)
      .height(42)
      .onClick(() => { this.activeTab = index; })
  }

  @Builder
  private envControl(label: string, value: number, min: number, max: number, unit: string, field: string) {
    Column({ space: 9 }) {
      Row() {
        Text(label).fontSize(15).fontColor(INK).fontWeight(FontWeight.Medium)
        Blank()
        Text(value.toString() + unit).fontSize(17).fontColor(BLUE).fontWeight(FontWeight.Bold)
      }.width('100%')
      Slider({ value: value, min: min, max: max, step: 1 })
        .blockColor(BLUE)
        .selectedColor(BLUE)
        .trackColor('#E7ECF7')
        .onChange((nextValue: number) => {
          if (field === 'temperature') { this.temperature = Math.round(nextValue); }
          if (field === 'humidity') { this.humidity = Math.round(nextValue); }
          if (field === 'lux') { this.lux = Math.round(nextValue); }
          this.persist();
        })
    }.width('100%')
  }

  @Builder
  private deviceCard(item: DeviceState) {
    Row({ space: 10 }) {
      Column({ space: 5 }) {
        Text(item.name).fontSize(15).fontColor(INK).fontWeight(FontWeight.Bold)
        Text(item.on ? '运行中 / 开启' : '待机 / 关闭')
          .fontSize(12).fontColor(item.on ? '#19835E' : MUTED)
      }.alignItems(HorizontalAlign.Start).layoutWeight(1)
      Button(item.on ? '关闭' : '开启')
        .fontColor(item.on ? '#A12A2A' : BLUE)
        .backgroundColor(item.on ? '#FDEDED' : '#E7EBFF')
        .height(35).borderRadius(8)
        .onClick(() => { this.toggleDevice(item.id); })
    }
      .width('100%').padding(14).backgroundColor('#FFFFFF').borderRadius(12)
  }

  @Builder
  private environmentPanel() {
    Column({ space: 16 }) {
      Column({ space: 8 }) {
        Text('模拟环境').fontSize(22).fontColor(INK).fontWeight(FontWeight.Bold)
        Text('调整 3 项环境数据，然后执行规则，设备状态将随之变化。')
          .fontSize(13).fontColor(MUTED)
      }.alignItems(HorizontalAlign.Start).width('100%')
      Row({ space: 10 }) {
        Button('☀ 盛夏午后')
          .layoutWeight(1).height(46).fontSize(14).fontColor('#784D00')
          .backgroundColor('#FFF3CD').borderRadius(10)
          .onClick(() => { this.useScene(0); })
        Button('☾ 夜间降温')
          .layoutWeight(1).height(46).fontSize(14).fontColor('#284F89')
          .backgroundColor('#DFEBFA').borderRadius(10)
          .onClick(() => { this.useScene(1); })
      }.width('100%')
      Column({ space: 18 }) {
        this.envControl('温度', this.temperature, 0, 40, '℃', 'temperature')
        this.envControl('湿度', this.humidity, 0, 100, '%', 'humidity')
        this.envControl('照度', this.lux, 0, 1000, 'lx', 'lux')
      }.padding(18).backgroundColor('#FFFFFF').borderRadius(14).width('100%')
      Row() {
        Text('设备面板').fontSize(18).fontColor(INK).fontWeight(FontWeight.Bold)
        Blank()
        Text('4 类可控设备').fontSize(12).fontColor(MUTED)
      }.width('100%')
      ForEach(this.devices, (item: DeviceState) => {
        this.deviceCard(item)
      }, (item: DeviceState): string => item.id)
      Button('▶ 执行一次联动演练')
        .fontSize(16).fontWeight(FontWeight.Bold).fontColor('#FFFFFF')
        .backgroundColor(BLUE).borderRadius(12).height(54).width('100%')
        .onClick(() => { this.execute(); })
      Text('规则引擎只在点击“执行演练”时运行，便于观察每次输入和结果。')
        .fontSize(12).fontColor(MUTED)
    }.alignItems(HorizontalAlign.Start).width('100%')
  }

  @Builder
  private editCondition(position: number) {
    Row({ space: 6 }) {
      Button(fieldLabel(position === 1 ? this.firstField : this.secondField) + ' ▾')
        .fontSize(13).fontColor(INK).backgroundColor('#EDF0F7').borderRadius(7)
        .onClick(() => {
          if (position === 1) { this.firstField = this.cycleField(this.firstField); }
          else { this.secondField = this.cycleField(this.secondField); }
        })
      Button(position === 1 ? this.firstOperator : this.secondOperator)
        .fontSize(13).fontColor(BLUE).backgroundColor('#EDF0F7').borderRadius(7)
        .onClick(() => {
          if (position === 1) { this.firstOperator = this.cycleOperator(this.firstOperator); }
          else { this.secondOperator = this.cycleOperator(this.secondOperator); }
        })
      TextInput({ text: position === 1 ? this.firstValueInput : this.secondValueInput,
        placeholder: '阈值' })
        .type(InputType.Number)
        .layoutWeight(1).height(40).backgroundColor('#F4F6FA')
        .onChange((value: string) => {
          if (position === 1) { this.firstValueInput = value; }
          else { this.secondValueInput = value; }
        })
    }.width('100%')
  }

  @Builder
  private ruleEditor() {
    Column({ space: 12 }) {
      Text(this.editingId.length > 0 ? '修改联动规则' : '新增联动规则')
        .fontSize(18).fontColor(INK).fontWeight(FontWeight.Bold)
      Text('规则名称').fontSize(13).fontColor(MUTED)
      TextInput({ text: this.nameInput, placeholder: '例如：高温自动开风扇' })
        .height(43).backgroundColor('#F4F6FA')
        .onChange((value: string) => { this.nameInput = value; })
      Text('条件 1（点击字段/操作符切换）').fontSize(13).fontColor(MUTED)
      this.editCondition(1)
      Row() {
        Text('双条件 AND').fontSize(13).fontColor(INK)
        Blank()
        Toggle({ type: ToggleType.Switch, isOn: this.twoConditions })
          .onChange((next: boolean) => { this.twoConditions = next; })
      }.width('100%')
      if (this.twoConditions) {
        Text('条件 2').fontSize(13).fontColor(MUTED)
        this.editCondition(2)
      }
      Text('设备动作').fontSize(13).fontColor(MUTED)
      Row({ space: 10 }) {
        Button(deviceLabel(this.selectedDevice) + ' ▾')
          .layoutWeight(1).fontSize(14).fontColor(INK)
          .backgroundColor('#EDF0F7').borderRadius(8)
          .onClick(() => { this.selectedDevice = this.cycleDevice(this.selectedDevice); })
        Button(this.selectedAction === 'ON' ? '执行：开启' : '执行：关闭')
          .layoutWeight(1).fontSize(14).fontColor(INK)
          .backgroundColor('#EDF0F7').borderRadius(8)
          .onClick(() => { this.selectedAction = this.selectedAction === 'ON' ? 'OFF' : 'ON'; })
      }.width('100%')
      Row({ space: 10 }) {
        Text('优先级（1~100）').fontSize(13).fontColor(MUTED)
        TextInput({ text: this.priorityInput, placeholder: '50' })
          .type(InputType.Number).width(100).height(40).backgroundColor('#F4F6FA')
          .onChange((value: string) => { this.priorityInput = value; })
      }
      Row({ space: 10 }) {
        Button('取消').layoutWeight(1).fontColor(INK).backgroundColor('#EAEFF7')
          .onClick(() => { this.editorOpen = false; })
        Button('保存规则').layoutWeight(1).fontColor('#FFFFFF').backgroundColor(BLUE)
          .onClick(() => { this.saveRule(); })
      }.width('100%')
    }.width('100%').padding(15).backgroundColor('#FFFFFF').borderRadius(14)
  }

  @Builder
  private ruleCard(rule: AutomationRule) {
    Column({ space: 10 }) {
      Row({ space: 8 }) {
        Text(rule.name).fontSize(15).fontColor(INK).fontWeight(FontWeight.Bold)
          .layoutWeight(1)
        Toggle({ type: ToggleType.Switch, isOn: rule.enabled })
          .onChange(() => { this.flipRuleEnabled(rule.id); })
      }.width('100%')
      Text('条件：' + RuleEngine.explainConditions(rule))
        .fontSize(13).fontColor(MUTED).width('100%')
      Row() {
        Text(deviceLabel(rule.targetDevice) + (rule.action === 'ON' ? ' → 开启' : ' → 关闭'))
          .fontSize(13).fontColor(BLUE)
        Blank()
        Text('优先级 P' + rule.priority.toString()).fontSize(12).fontColor(MUTED)
      }.width('100%')
      Row({ space: 12 }) {
        Button('编辑').layoutWeight(1).height(34)
          .fontColor(BLUE).backgroundColor('#E7EBFF')
          .onClick(() => { this.editRule(rule); })
        Button('删除').layoutWeight(1).height(34)
          .fontColor('#B12D38').backgroundColor('#FCE9EC')
          .onClick(() => { this.deleteRule(rule.id); })
      }.width('100%')
    }.width('100%').padding(15).backgroundColor('#FFFFFF').borderRadius(13)
  }

  @Builder
  private rulesPanel() {
    Column({ space: 14 }) {
      Row() {
        Column({ space: 5 }) {
          Text('自动化规则').fontSize(22).fontColor(INK).fontWeight(FontWeight.Bold)
          Text('支持新增、编辑、启停、删除和优先级调整')
            .fontSize(13).fontColor(MUTED)
        }.alignItems(HorizontalAlign.Start).layoutWeight(1)
        Button('＋ 新建').fontSize(13).backgroundColor(BLUE).height(40)
          .onClick(() => { this.startNewRule(); })
      }.width('100%')
      if (this.editorOpen) { this.ruleEditor() }
      ForEach(this.rules, (rule: AutomationRule) => { this.ruleCard(rule) },
        (rule: AutomationRule): string => rule.id)
      if (this.rules.length === 0) {
        Text('当前没有规则，请点击“新建”。').fontSize(13).fontColor(MUTED).margin({ top: 16 })
      }
      Text('冲突策略：同一轮中先执行优先级高的规则；同设备后续命中规则跳过并记日志。')
        .fontSize(12).fontColor(MUTED)
    }.alignItems(HorizontalAlign.Start).width('100%')
  }

  @Builder
  private logCard(log: ExecutionLog) {
    Column({ space: 6 }) {
      Row() {
        Text('#' + log.order.toString() + '  ' + log.ruleName)
          .fontSize(14).fontColor(INK).fontWeight(FontWeight.Bold).layoutWeight(1)
        Text(log.status === 'APPLIED' ? '已执行' : '冲突跳过')
          .fontSize(12).fontColor(log.status === 'APPLIED' ? '#16815A' : '#D67B1D')
      }.width('100%')
      Text('触发条件：' + log.conditionText).fontSize(12).fontColor(MUTED)
      Text(log.message).fontSize(12).fontColor(MUTED)
      Text(new Date(log.time).toLocaleString()).fontSize(11).fontColor('#8391A9')
    }.width('100%').padding(14).backgroundColor('#FFFFFF').borderRadius(12)
  }

  @Builder
  private logsPanel() {
    Column({ space: 14 }) {
      Row() {
        Column({ space: 4 }) {
          Text('执行日志').fontSize(22).fontColor(INK).fontWeight(FontWeight.Bold)
          Text('最多保留最近 100 条记录，重启应用后仍可查看。')
            .fontSize(12).fontColor(MUTED)
        }.alignItems(HorizontalAlign.Start).layoutWeight(1)
        Button('清空日志').fontSize(12).backgroundColor('#E9EDF5').fontColor(MUTED)
          .onClick(() => { this.logs = []; this.persist(); })
      }.width('100%')
      if (this.logs.length === 0) {
        Column({ space: 8 }) {
          Text('暂无运行记录').fontSize(17).fontColor(INK)
          Text('先到「环境」中运行一次联动演练。').fontSize(13).fontColor(MUTED)
        }.width('100%').padding(26).backgroundColor('#FFFFFF').borderRadius(14)
      }
      ForEach(this.logs.slice().reverse(), (log: ExecutionLog) => { this.logCard(log) },
        (log: ExecutionLog): string => log.id)
    }.width('100%').alignItems(HorizontalAlign.Start)
  }

  build() {
    Column({ space: 0 }) {
      Column({ space: 8 }) {
        Text('DORMLINK  ·  联动实验室')
          .fontSize(13).fontColor('#C8D5FF').fontWeight(FontWeight.Bold)
        Text('让宿舍拥有自己的自动化')
          .fontSize(23).fontColor('#FFFFFF').fontWeight(FontWeight.Bold)
        Text('模拟环境 · 规则编排 · 设备联动 · 数据恢复')
          .fontSize(12).fontColor('#E2EAFF')
      }.width('100%').padding({ left: 20, right: 20, top: 22, bottom: 22 })
        .alignItems(HorizontalAlign.Start).backgroundColor('#213B90')
      Row({ space: 8 }) {
        this.tabItem(0, '环境演练')
        this.tabItem(1, '规则管理')
        this.tabItem(2, '执行日志')
      }.width('100%').padding(12).backgroundColor('#FFFFFF')
      Scroll() {
        Column({ space: 15 }) {
          Text(this.banner).width('100%').fontColor('#48669D').fontSize(12)
            .padding(11).backgroundColor('#E8F0FF').borderRadius(10)
          if (this.activeTab === 0) { this.environmentPanel() }
          if (this.activeTab === 1) { this.rulesPanel() }
          if (this.activeTab === 2) { this.logsPanel() }
        }.width('100%').padding(15)
      }.layoutWeight(1).scrollBar(BarState.Off)
    }.height('100%').width('100%').backgroundColor(BG)
  }
}
