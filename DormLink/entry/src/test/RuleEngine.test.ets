import { describe, expect, it } from '@ohos/hypium';
import { AutomationRule, DeviceState, Environment, defaultDevices, defaultRules } from '../main/ets/models/Models';
import { RuleEngine } from '../main/ets/engine/RuleEngine';

const HOT: Environment = { temperature: 33, humidity: 82, lux: 900 };

function singleRule(id: string, priority: number, action: string): AutomationRule {
  return {
    id: id, name: '温度联动' + id, enabled: true, priority: priority,
    conditions: [{ field: 'temperature', operator: '>=', value: 28 }],
    targetDevice: 'FAN', action: action
  };
}

export default function ruleEngineTest() {
  describe('RuleEngine_MockCases', () => {
    // 正常：AND两条件同时成立
    it('TC01_AND_both_true', 0, () => {
      let result = RuleEngine.evaluate(HOT, [defaultRules()[0]], defaultDevices(), 1000);
      expect(result.matchedCount).assertEqual(1);
      expect(result.devices[1].on).assertTrue();
      expect(result.logs[0].status).assertEqual('APPLIED');
    });

    // 边界：AND 中任意一个条件不成立
    it('TC02_AND_one_false', 0, () => {
      let env: Environment = { temperature: 33, humidity: 69, lux: 900 };
      let result = RuleEngine.evaluate(env, [defaultRules()[0]], defaultDevices(), 1000);
      expect(result.matchedCount).assertEqual(0);
      expect(result.devices[1].on).assertFalse();
    });

    // 正常：高优先级命中，低优先级反向动作被跳过
    it('TC03_conflict_priority', 0, () => {
      let rules: AutomationRule[] = [singleRule('R9', 30, 'OFF'), singleRule('R8', 90, 'ON')];
      let result = RuleEngine.evaluate(HOT, rules, defaultDevices(), 1000);
      expect(result.devices[1].on).assertTrue();
      expect(result.logs[0].ruleId).assertEqual('R8');
      expect(result.logs[1].status).assertEqual('SKIPPED_CONFLICT');
      expect(result.logs[1].nextOn).assertTrue();
    });

    // 边界：优先级相同则ID升序
    it('TC04_tie_id_order', 0, () => {
      let rules: AutomationRule[] = [singleRule('R2', 50, 'OFF'), singleRule('R1', 50, 'ON')];
      let result = RuleEngine.evaluate(HOT, rules, defaultDevices(), 1000);
      expect(result.logs[0].ruleId).assertEqual('R1');
      expect(result.devices[1].on).assertTrue();
    });

    // 正常：已禁用规则不触发
    it('TC05_disabled_rule', 0, () => {
      let rule: AutomationRule = singleRule('R11', 99, 'ON');
      rule.enabled = false;
      let result = RuleEngine.evaluate(HOT, [rule], defaultDevices(), 1000);
      expect(result.matchedCount).assertEqual(0);
    });

    // 边界：>= 等于阈值时触发
    it('TC06_threshold_equal', 0, () => {
      let env: Environment = { temperature: 28, humidity: 50, lux: 400 };
      let result = RuleEngine.evaluate(env, [singleRule('R1', 30, 'ON')], defaultDevices(), 1000);
      expect(result.matchedCount).assertEqual(1);
    });

    // 异常：超出可用环境范围必须拒绝
    it('TC07_invalid_environment', 0, () => {
      let invalid: Environment = { temperature: 41, humidity: 30, lux: 100 };
      let threw: boolean = false;
      try { RuleEngine.evaluate(invalid, [], defaultDevices(), 1000); }
      catch (err) { threw = true; }
      expect(threw).assertTrue();
    });

    // 异常：超出字段阈值范围拒绝保存
    it('TC08_invalid_threshold', 0, () => {
      let rule: AutomationRule = singleRule('R1', 20, 'ON');
      rule.conditions[0].value = 50;
      expect(RuleEngine.validateRule(rule)).assertEqual('温度阈值必须在0~40℃');
    });

    // 异常：非法设备编号拒绝保存
    it('TC09_invalid_device', 0, () => {
      let rule: AutomationRule = singleRule('R1', 20, 'ON');
      rule.targetDevice = 'DOOR';
      expect(RuleEngine.validateRule(rule)).assertEqual('目标设备无效');
    });

    // 正常：引擎不可原位修改入参对象
    it('TC10_no_mutate_input', 0, () => {
      let source: DeviceState[] = defaultDevices();
      let result = RuleEngine.evaluate(HOT, [singleRule('R1', 20, 'ON')], source, 1000);
      expect(source[1].on).assertFalse();
      expect(result.devices[1].on).assertTrue();
    });

    // 边界：日志执行顺序连续，命中数正确
    it('TC11_logs_sequence', 0, () => {
      let result = RuleEngine.evaluate(HOT, defaultRules(), defaultDevices(), 1000);
      expect(result.logs.length).assertEqual(2); // 盛夏午后命中：风扇、窗帘
      expect(result.logs[0].order).assertEqual(1);
      expect(result.logs[1].order).assertEqual(2);
    });

    // 异常：优先级不是有效整数则拒绝
    it('TC12_invalid_priority', 0, () => {
      let rule: AutomationRule = singleRule('R1', 101, 'ON');
      expect(RuleEngine.validateRule(rule)).assertEqual('优先级必须为1~100的整数');
    });
  });
}
