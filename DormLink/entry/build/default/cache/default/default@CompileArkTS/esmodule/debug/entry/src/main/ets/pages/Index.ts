if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface Index_Params {
    activeTab?: number;
    temperature?: number;
    humidity?: number;
    lux?: number;
    devices?: DeviceState[];
    rules?: AutomationRule[];
    logs?: ExecutionLog[];
    nextRuleId?: number;
    banner?: string;
    editingId?: string;
    editorOpen?: boolean;
    nameInput?: string;
    priorityInput?: string;
    firstField?: string;
    firstOperator?: string;
    firstValueInput?: string;
    twoConditions?: boolean;
    secondField?: string;
    secondOperator?: string;
    secondValueInput?: string;
    selectedDevice?: string;
    selectedAction?: string;
    repository?: SnapshotRepository | null;
}
import promptAction from "@ohos:promptAction";
import { defaultSnapshot, deviceLabel, fieldLabel } from "@bundle:com.example.dormlink/entry/ets/models/Models";
import type { AppSnapshot, AutomationRule, DeviceState, EngineResult, Environment, ExecutionLog, RuleCondition } from "@bundle:com.example.dormlink/entry/ets/models/Models";
import { RuleEngine } from "@bundle:com.example.dormlink/entry/ets/engine/RuleEngine";
import { SnapshotRepository } from "@bundle:com.example.dormlink/entry/ets/data/SnapshotRepository";
const BG: string = '#F5F7FB';
const BLUE: string = '#3559E0';
const INK: string = '#17233C';
const MUTED: string = '#65728B';
class Index extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__activeTab = new ObservedPropertySimplePU(0, this, "activeTab");
        this.__temperature = new ObservedPropertySimplePU(25, this, "temperature");
        this.__humidity = new ObservedPropertySimplePU(55, this, "humidity");
        this.__lux = new ObservedPropertySimplePU(550, this, "lux");
        this.__devices = new ObservedPropertyObjectPU([], this, "devices");
        this.__rules = new ObservedPropertyObjectPU([], this, "rules");
        this.__logs = new ObservedPropertyObjectPU([], this, "logs");
        this.__nextRuleId = new ObservedPropertySimplePU(5, this, "nextRuleId");
        this.__banner = new ObservedPropertySimplePU('请选择模拟场景或滑动环境参数', this, "banner");
        this.__editingId = new ObservedPropertySimplePU('', this, "editingId");
        this.__editorOpen = new ObservedPropertySimplePU(false, this, "editorOpen");
        this.__nameInput = new ObservedPropertySimplePU('', this, "nameInput");
        this.__priorityInput = new ObservedPropertySimplePU('50', this, "priorityInput");
        this.__firstField = new ObservedPropertySimplePU('temperature', this, "firstField");
        this.__firstOperator = new ObservedPropertySimplePU('>=', this, "firstOperator");
        this.__firstValueInput = new ObservedPropertySimplePU('28', this, "firstValueInput");
        this.__twoConditions = new ObservedPropertySimplePU(false, this, "twoConditions");
        this.__secondField = new ObservedPropertySimplePU('humidity', this, "secondField");
        this.__secondOperator = new ObservedPropertySimplePU('>=', this, "secondOperator");
        this.__secondValueInput = new ObservedPropertySimplePU('70', this, "secondValueInput");
        this.__selectedDevice = new ObservedPropertySimplePU('FAN', this, "selectedDevice");
        this.__selectedAction = new ObservedPropertySimplePU('ON', this, "selectedAction");
        this.repository = null;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: Index_Params) {
        if (params.activeTab !== undefined) {
            this.activeTab = params.activeTab;
        }
        if (params.temperature !== undefined) {
            this.temperature = params.temperature;
        }
        if (params.humidity !== undefined) {
            this.humidity = params.humidity;
        }
        if (params.lux !== undefined) {
            this.lux = params.lux;
        }
        if (params.devices !== undefined) {
            this.devices = params.devices;
        }
        if (params.rules !== undefined) {
            this.rules = params.rules;
        }
        if (params.logs !== undefined) {
            this.logs = params.logs;
        }
        if (params.nextRuleId !== undefined) {
            this.nextRuleId = params.nextRuleId;
        }
        if (params.banner !== undefined) {
            this.banner = params.banner;
        }
        if (params.editingId !== undefined) {
            this.editingId = params.editingId;
        }
        if (params.editorOpen !== undefined) {
            this.editorOpen = params.editorOpen;
        }
        if (params.nameInput !== undefined) {
            this.nameInput = params.nameInput;
        }
        if (params.priorityInput !== undefined) {
            this.priorityInput = params.priorityInput;
        }
        if (params.firstField !== undefined) {
            this.firstField = params.firstField;
        }
        if (params.firstOperator !== undefined) {
            this.firstOperator = params.firstOperator;
        }
        if (params.firstValueInput !== undefined) {
            this.firstValueInput = params.firstValueInput;
        }
        if (params.twoConditions !== undefined) {
            this.twoConditions = params.twoConditions;
        }
        if (params.secondField !== undefined) {
            this.secondField = params.secondField;
        }
        if (params.secondOperator !== undefined) {
            this.secondOperator = params.secondOperator;
        }
        if (params.secondValueInput !== undefined) {
            this.secondValueInput = params.secondValueInput;
        }
        if (params.selectedDevice !== undefined) {
            this.selectedDevice = params.selectedDevice;
        }
        if (params.selectedAction !== undefined) {
            this.selectedAction = params.selectedAction;
        }
        if (params.repository !== undefined) {
            this.repository = params.repository;
        }
    }
    updateStateVars(params: Index_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__activeTab.purgeDependencyOnElmtId(rmElmtId);
        this.__temperature.purgeDependencyOnElmtId(rmElmtId);
        this.__humidity.purgeDependencyOnElmtId(rmElmtId);
        this.__lux.purgeDependencyOnElmtId(rmElmtId);
        this.__devices.purgeDependencyOnElmtId(rmElmtId);
        this.__rules.purgeDependencyOnElmtId(rmElmtId);
        this.__logs.purgeDependencyOnElmtId(rmElmtId);
        this.__nextRuleId.purgeDependencyOnElmtId(rmElmtId);
        this.__banner.purgeDependencyOnElmtId(rmElmtId);
        this.__editingId.purgeDependencyOnElmtId(rmElmtId);
        this.__editorOpen.purgeDependencyOnElmtId(rmElmtId);
        this.__nameInput.purgeDependencyOnElmtId(rmElmtId);
        this.__priorityInput.purgeDependencyOnElmtId(rmElmtId);
        this.__firstField.purgeDependencyOnElmtId(rmElmtId);
        this.__firstOperator.purgeDependencyOnElmtId(rmElmtId);
        this.__firstValueInput.purgeDependencyOnElmtId(rmElmtId);
        this.__twoConditions.purgeDependencyOnElmtId(rmElmtId);
        this.__secondField.purgeDependencyOnElmtId(rmElmtId);
        this.__secondOperator.purgeDependencyOnElmtId(rmElmtId);
        this.__secondValueInput.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedDevice.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedAction.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__activeTab.aboutToBeDeleted();
        this.__temperature.aboutToBeDeleted();
        this.__humidity.aboutToBeDeleted();
        this.__lux.aboutToBeDeleted();
        this.__devices.aboutToBeDeleted();
        this.__rules.aboutToBeDeleted();
        this.__logs.aboutToBeDeleted();
        this.__nextRuleId.aboutToBeDeleted();
        this.__banner.aboutToBeDeleted();
        this.__editingId.aboutToBeDeleted();
        this.__editorOpen.aboutToBeDeleted();
        this.__nameInput.aboutToBeDeleted();
        this.__priorityInput.aboutToBeDeleted();
        this.__firstField.aboutToBeDeleted();
        this.__firstOperator.aboutToBeDeleted();
        this.__firstValueInput.aboutToBeDeleted();
        this.__twoConditions.aboutToBeDeleted();
        this.__secondField.aboutToBeDeleted();
        this.__secondOperator.aboutToBeDeleted();
        this.__secondValueInput.aboutToBeDeleted();
        this.__selectedDevice.aboutToBeDeleted();
        this.__selectedAction.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __activeTab: ObservedPropertySimplePU<number>;
    get activeTab() {
        return this.__activeTab.get();
    }
    set activeTab(newValue: number) {
        this.__activeTab.set(newValue);
    }
    private __temperature: ObservedPropertySimplePU<number>;
    get temperature() {
        return this.__temperature.get();
    }
    set temperature(newValue: number) {
        this.__temperature.set(newValue);
    }
    private __humidity: ObservedPropertySimplePU<number>;
    get humidity() {
        return this.__humidity.get();
    }
    set humidity(newValue: number) {
        this.__humidity.set(newValue);
    }
    private __lux: ObservedPropertySimplePU<number>;
    get lux() {
        return this.__lux.get();
    }
    set lux(newValue: number) {
        this.__lux.set(newValue);
    }
    private __devices: ObservedPropertyObjectPU<DeviceState[]>;
    get devices() {
        return this.__devices.get();
    }
    set devices(newValue: DeviceState[]) {
        this.__devices.set(newValue);
    }
    private __rules: ObservedPropertyObjectPU<AutomationRule[]>;
    get rules() {
        return this.__rules.get();
    }
    set rules(newValue: AutomationRule[]) {
        this.__rules.set(newValue);
    }
    private __logs: ObservedPropertyObjectPU<ExecutionLog[]>;
    get logs() {
        return this.__logs.get();
    }
    set logs(newValue: ExecutionLog[]) {
        this.__logs.set(newValue);
    }
    private __nextRuleId: ObservedPropertySimplePU<number>;
    get nextRuleId() {
        return this.__nextRuleId.get();
    }
    set nextRuleId(newValue: number) {
        this.__nextRuleId.set(newValue);
    }
    private __banner: ObservedPropertySimplePU<string>;
    get banner() {
        return this.__banner.get();
    }
    set banner(newValue: string) {
        this.__banner.set(newValue);
    }
    private __editingId: ObservedPropertySimplePU<string>;
    get editingId() {
        return this.__editingId.get();
    }
    set editingId(newValue: string) {
        this.__editingId.set(newValue);
    }
    private __editorOpen: ObservedPropertySimplePU<boolean>;
    get editorOpen() {
        return this.__editorOpen.get();
    }
    set editorOpen(newValue: boolean) {
        this.__editorOpen.set(newValue);
    }
    private __nameInput: ObservedPropertySimplePU<string>;
    get nameInput() {
        return this.__nameInput.get();
    }
    set nameInput(newValue: string) {
        this.__nameInput.set(newValue);
    }
    private __priorityInput: ObservedPropertySimplePU<string>;
    get priorityInput() {
        return this.__priorityInput.get();
    }
    set priorityInput(newValue: string) {
        this.__priorityInput.set(newValue);
    }
    private __firstField: ObservedPropertySimplePU<string>;
    get firstField() {
        return this.__firstField.get();
    }
    set firstField(newValue: string) {
        this.__firstField.set(newValue);
    }
    private __firstOperator: ObservedPropertySimplePU<string>;
    get firstOperator() {
        return this.__firstOperator.get();
    }
    set firstOperator(newValue: string) {
        this.__firstOperator.set(newValue);
    }
    private __firstValueInput: ObservedPropertySimplePU<string>;
    get firstValueInput() {
        return this.__firstValueInput.get();
    }
    set firstValueInput(newValue: string) {
        this.__firstValueInput.set(newValue);
    }
    private __twoConditions: ObservedPropertySimplePU<boolean>;
    get twoConditions() {
        return this.__twoConditions.get();
    }
    set twoConditions(newValue: boolean) {
        this.__twoConditions.set(newValue);
    }
    private __secondField: ObservedPropertySimplePU<string>;
    get secondField() {
        return this.__secondField.get();
    }
    set secondField(newValue: string) {
        this.__secondField.set(newValue);
    }
    private __secondOperator: ObservedPropertySimplePU<string>;
    get secondOperator() {
        return this.__secondOperator.get();
    }
    set secondOperator(newValue: string) {
        this.__secondOperator.set(newValue);
    }
    private __secondValueInput: ObservedPropertySimplePU<string>;
    get secondValueInput() {
        return this.__secondValueInput.get();
    }
    set secondValueInput(newValue: string) {
        this.__secondValueInput.set(newValue);
    }
    private __selectedDevice: ObservedPropertySimplePU<string>;
    get selectedDevice() {
        return this.__selectedDevice.get();
    }
    set selectedDevice(newValue: string) {
        this.__selectedDevice.set(newValue);
    }
    private __selectedAction: ObservedPropertySimplePU<string>;
    get selectedAction() {
        return this.__selectedAction.get();
    }
    set selectedAction(newValue: string) {
        this.__selectedAction.set(newValue);
    }
    private repository: SnapshotRepository | null;
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
        }
        catch (err) {
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
        if (this.repository === null) {
            return;
        }
        try {
            await this.repository.save(this.currentSnapshot());
        }
        catch (err) {
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
        }
        else {
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
        }
        catch (err) {
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
            }
            else {
                next.push(rule);
            }
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
        }
        else {
            this.secondField = 'humidity';
            this.secondOperator = '>=';
            this.secondValueInput = '70';
        }
        this.selectedDevice = rule.targetDevice;
        this.selectedAction = rule.action;
        this.editorOpen = true;
    }
    private cycleField(current: string): string {
        if (current === 'temperature') {
            return 'humidity';
        }
        if (current === 'humidity') {
            return 'lux';
        }
        return 'temperature';
    }
    private cycleOperator(current: string): string {
        if (current === '>') {
            return '>=';
        }
        if (current === '>=') {
            return '<';
        }
        if (current === '<') {
            return '<=';
        }
        if (current === '<=') {
            return '==';
        }
        return '>';
    }
    private cycleDevice(current: string): string {
        if (current === 'LIGHT') {
            return 'FAN';
        }
        if (current === 'FAN') {
            return 'AC';
        }
        if (current === 'AC') {
            return 'CURTAIN';
        }
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
            }
            else {
                next.push(this.rules[i]);
            }
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
    private tabItem(index: number, caption: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(caption);
            Button.fontSize(14);
            Button.fontWeight(FontWeight.Medium);
            Button.fontColor(this.activeTab === index ? '#FFFFFF' : MUTED);
            Button.backgroundColor(this.activeTab === index ? BLUE : '#FFFFFF');
            Button.borderRadius(10);
            Button.layoutWeight(1);
            Button.height(42);
            Button.onClick(() => { this.activeTab = index; });
        }, Button);
        Button.pop();
    }
    private envControl(label: string, value: number, min: number, max: number, unit: string, field: string, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 9 });
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(label);
            Text.fontSize(15);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Medium);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(value.toString() + unit);
            Text.fontSize(17);
            Text.fontColor(BLUE);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Slider.create({ value: value, min: min, max: max, step: 1 });
            Slider.blockColor(BLUE);
            Slider.selectedColor(BLUE);
            Slider.trackColor('#E7ECF7');
            Slider.onChange((nextValue: number) => {
                if (field === 'temperature') {
                    this.temperature = Math.round(nextValue);
                }
                if (field === 'humidity') {
                    this.humidity = Math.round(nextValue);
                }
                if (field === 'lux') {
                    this.lux = Math.round(nextValue);
                }
                this.persist();
            });
        }, Slider);
        Column.pop();
    }
    private deviceCard(item: DeviceState, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('100%');
            Row.padding(14);
            Row.backgroundColor('#FFFFFF');
            Row.borderRadius(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.name);
            Text.fontSize(15);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(item.on ? '运行中 / 开启' : '待机 / 关闭');
            Text.fontSize(12);
            Text.fontColor(item.on ? '#19835E' : MUTED);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(item.on ? '关闭' : '开启');
            Button.fontColor(item.on ? '#A12A2A' : BLUE);
            Button.backgroundColor(item.on ? '#FDEDED' : '#E7EBFF');
            Button.height(35);
            Button.borderRadius(8);
            Button.onClick(() => { this.toggleDevice(item.id); });
        }, Button);
        Button.pop();
        Row.pop();
    }
    private environmentPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 16 });
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('模拟环境');
            Text.fontSize(22);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('调整 3 项环境数据，然后执行规则，设备状态将随之变化。');
            Text.fontSize(13);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('☀ 盛夏午后');
            Button.layoutWeight(1);
            Button.height(46);
            Button.fontSize(14);
            Button.fontColor('#784D00');
            Button.backgroundColor('#FFF3CD');
            Button.borderRadius(10);
            Button.onClick(() => { this.useScene(0); });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('☾ 夜间降温');
            Button.layoutWeight(1);
            Button.height(46);
            Button.fontSize(14);
            Button.fontColor('#284F89');
            Button.backgroundColor('#DFEBFA');
            Button.borderRadius(10);
            Button.onClick(() => { this.useScene(1); });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 18 });
            Column.padding(18);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(14);
            Column.width('100%');
        }, Column);
        this.envControl.bind(this)('温度', this.temperature, 0, 40, '℃', 'temperature');
        this.envControl.bind(this)('湿度', this.humidity, 0, 100, '%', 'humidity');
        this.envControl.bind(this)('照度', this.lux, 0, 1000, 'lx', 'lux');
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设备面板');
            Text.fontSize(18);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('4 类可控设备');
            Text.fontSize(12);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                this.deviceCard.bind(this)(item);
            };
            this.forEachUpdateFunction(elmtId, this.devices, forEachItemGenFunction, (item: DeviceState): string => item.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('▶ 执行一次联动演练');
            Button.fontSize(16);
            Button.fontWeight(FontWeight.Bold);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor(BLUE);
            Button.borderRadius(12);
            Button.height(54);
            Button.width('100%');
            Button.onClick(() => { this.execute(); });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('规则引擎只在点击“执行演练”时运行，便于观察每次输入和结果。');
            Text.fontSize(12);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        Column.pop();
    }
    private editCondition(position: number, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 6 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(fieldLabel(position === 1 ? this.firstField : this.secondField) + ' ▾');
            Button.fontSize(13);
            Button.fontColor(INK);
            Button.backgroundColor('#EDF0F7');
            Button.borderRadius(7);
            Button.onClick(() => {
                if (position === 1) {
                    this.firstField = this.cycleField(this.firstField);
                }
                else {
                    this.secondField = this.cycleField(this.secondField);
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(position === 1 ? this.firstOperator : this.secondOperator);
            Button.fontSize(13);
            Button.fontColor(BLUE);
            Button.backgroundColor('#EDF0F7');
            Button.borderRadius(7);
            Button.onClick(() => {
                if (position === 1) {
                    this.firstOperator = this.cycleOperator(this.firstOperator);
                }
                else {
                    this.secondOperator = this.cycleOperator(this.secondOperator);
                }
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: position === 1 ? this.firstValueInput : this.secondValueInput,
                placeholder: '阈值' });
            TextInput.type(InputType.Number);
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.backgroundColor('#F4F6FA');
            TextInput.onChange((value: string) => {
                if (position === 1) {
                    this.firstValueInput = value;
                }
                else {
                    this.secondValueInput = value;
                }
            });
        }, TextInput);
        Row.pop();
    }
    private ruleEditor(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 12 });
            Column.width('100%');
            Column.padding(15);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(14);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.editingId.length > 0 ? '修改联动规则' : '新增联动规则');
            Text.fontSize(18);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('规则名称');
            Text.fontSize(13);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.nameInput, placeholder: '例如：高温自动开风扇' });
            TextInput.height(43);
            TextInput.backgroundColor('#F4F6FA');
            TextInput.onChange((value: string) => { this.nameInput = value; });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('条件 1（点击字段/操作符切换）');
            Text.fontSize(13);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        this.editCondition.bind(this)(1);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('双条件 AND');
            Text.fontSize(13);
            Text.fontColor(INK);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: this.twoConditions });
            Toggle.onChange((next: boolean) => { this.twoConditions = next; });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.twoConditions) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('条件 2');
                        Text.fontSize(13);
                        Text.fontColor(MUTED);
                    }, Text);
                    Text.pop();
                    this.editCondition.bind(this)(2);
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('设备动作');
            Text.fontSize(13);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(deviceLabel(this.selectedDevice) + ' ▾');
            Button.layoutWeight(1);
            Button.fontSize(14);
            Button.fontColor(INK);
            Button.backgroundColor('#EDF0F7');
            Button.borderRadius(8);
            Button.onClick(() => { this.selectedDevice = this.cycleDevice(this.selectedDevice); });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.selectedAction === 'ON' ? '执行：开启' : '执行：关闭');
            Button.layoutWeight(1);
            Button.fontSize(14);
            Button.fontColor(INK);
            Button.backgroundColor('#EDF0F7');
            Button.borderRadius(8);
            Button.onClick(() => { this.selectedAction = this.selectedAction === 'ON' ? 'OFF' : 'ON'; });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('优先级（1~100）');
            Text.fontSize(13);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ text: this.priorityInput, placeholder: '50' });
            TextInput.type(InputType.Number);
            TextInput.width(100);
            TextInput.height(40);
            TextInput.backgroundColor('#F4F6FA');
            TextInput.onChange((value: string) => { this.priorityInput = value; });
        }, TextInput);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 10 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('取消');
            Button.layoutWeight(1);
            Button.fontColor(INK);
            Button.backgroundColor('#EAEFF7');
            Button.onClick(() => { this.editorOpen = false; });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('保存规则');
            Button.layoutWeight(1);
            Button.fontColor('#FFFFFF');
            Button.backgroundColor(BLUE);
            Button.onClick(() => { this.saveRule(); });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    private ruleCard(rule: AutomationRule, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 10 });
            Column.width('100%');
            Column.padding(15);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(13);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(rule.name);
            Text.fontSize(15);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Switch, isOn: rule.enabled });
            Toggle.onChange(() => { this.flipRuleEnabled(rule.id); });
        }, Toggle);
        Toggle.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('条件：' + RuleEngine.explainConditions(rule));
            Text.fontSize(13);
            Text.fontColor(MUTED);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(deviceLabel(rule.targetDevice) + (rule.action === 'ON' ? ' → 开启' : ' → 关闭'));
            Text.fontSize(13);
            Text.fontColor(BLUE);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('优先级 P' + rule.priority.toString());
            Text.fontSize(12);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 12 });
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('编辑');
            Button.layoutWeight(1);
            Button.height(34);
            Button.fontColor(BLUE);
            Button.backgroundColor('#E7EBFF');
            Button.onClick(() => { this.editRule(rule); });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('删除');
            Button.layoutWeight(1);
            Button.height(34);
            Button.fontColor('#B12D38');
            Button.backgroundColor('#FCE9EC');
            Button.onClick(() => { this.deleteRule(rule.id); });
        }, Button);
        Button.pop();
        Row.pop();
        Column.pop();
    }
    private rulesPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.alignItems(HorizontalAlign.Start);
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 5 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('自动化规则');
            Text.fontSize(22);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('支持新增、编辑、启停、删除和优先级调整');
            Text.fontSize(13);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('＋ 新建');
            Button.fontSize(13);
            Button.backgroundColor(BLUE);
            Button.height(40);
            Button.onClick(() => { this.startNewRule(); });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.editorOpen) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.ruleEditor.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const rule = _item;
                this.ruleCard.bind(this)(rule);
            };
            this.forEachUpdateFunction(elmtId, this.rules, forEachItemGenFunction, (rule: AutomationRule): string => rule.id, false, false);
        }, ForEach);
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.rules.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('当前没有规则，请点击“新建”。');
                        Text.fontSize(13);
                        Text.fontColor(MUTED);
                        Text.margin({ top: 16 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('冲突策略：同一轮中先执行优先级高的规则；同设备后续命中规则跳过并记日志。');
            Text.fontSize(12);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        Column.pop();
    }
    private logCard(log: ExecutionLog, parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 6 });
            Column.width('100%');
            Column.padding(14);
            Column.backgroundColor('#FFFFFF');
            Column.borderRadius(12);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('#' + log.order.toString() + '  ' + log.ruleName);
            Text.fontSize(14);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(log.status === 'APPLIED' ? '已执行' : '冲突跳过');
            Text.fontSize(12);
            Text.fontColor(log.status === 'APPLIED' ? '#16815A' : '#D67B1D');
        }, Text);
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('触发条件：' + log.conditionText);
            Text.fontSize(12);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(log.message);
            Text.fontSize(12);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(new Date(log.time).toLocaleString());
            Text.fontSize(11);
            Text.fontColor('#8391A9');
        }, Text);
        Text.pop();
        Column.pop();
    }
    private logsPanel(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 14 });
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Start);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 4 });
            Column.alignItems(HorizontalAlign.Start);
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('执行日志');
            Text.fontSize(22);
            Text.fontColor(INK);
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('最多保留最近 100 条记录，重启应用后仍可查看。');
            Text.fontSize(12);
            Text.fontColor(MUTED);
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('清空日志');
            Button.fontSize(12);
            Button.backgroundColor('#E9EDF5');
            Button.fontColor(MUTED);
            Button.onClick(() => { this.logs = []; this.persist(); });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.logs.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create({ space: 8 });
                        Column.width('100%');
                        Column.padding(26);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(14);
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无运行记录');
                        Text.fontSize(17);
                        Text.fontColor(INK);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('先到「环境」中运行一次联动演练。');
                        Text.fontSize(13);
                        Text.fontColor(MUTED);
                    }, Text);
                    Text.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const log = _item;
                this.logCard.bind(this)(log);
            };
            this.forEachUpdateFunction(elmtId, this.logs.slice().reverse(), forEachItemGenFunction, (log: ExecutionLog): string => log.id, false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 0 });
            Column.height('100%');
            Column.width('100%');
            Column.backgroundColor(BG);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 8 });
            Column.width('100%');
            Column.padding({ left: 20, right: 20, top: 22, bottom: 22 });
            Column.alignItems(HorizontalAlign.Start);
            Column.backgroundColor('#213B90');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('DORMLINK  ·  联动实验室');
            Text.fontSize(13);
            Text.fontColor('#C8D5FF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('让宿舍拥有自己的自动化');
            Text.fontSize(23);
            Text.fontColor('#FFFFFF');
            Text.fontWeight(FontWeight.Bold);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('模拟环境 · 规则编排 · 设备联动 · 数据恢复');
            Text.fontSize(12);
            Text.fontColor('#E2EAFF');
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create({ space: 8 });
            Row.width('100%');
            Row.padding(12);
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.tabItem.bind(this)(0, '环境演练');
        this.tabItem.bind(this)(1, '规则管理');
        this.tabItem.bind(this)(2, '执行日志');
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
            Scroll.scrollBar(BarState.Off);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 15 });
            Column.width('100%');
            Column.padding(15);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.banner);
            Text.width('100%');
            Text.fontColor('#48669D');
            Text.fontSize(12);
            Text.padding(11);
            Text.backgroundColor('#E8F0FF');
            Text.borderRadius(10);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.activeTab === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.environmentPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.activeTab === 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.rulesPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.activeTab === 2) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.logsPanel.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        Scroll.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    public __resetStateVarsOnReuse__Internal(params: Object): void {
    }
    static getEntryName(): string {
        return "Index";
    }
}
registerNamedRoute(() => new Index(undefined, {}), "", { bundleName: "com.example.dormlink", moduleName: "entry", pagePath: "pages/Index", pageFullPath: "entry/src/main/ets/pages/Index", integratedHsp: "false", moduleType: "followWithHap" });
