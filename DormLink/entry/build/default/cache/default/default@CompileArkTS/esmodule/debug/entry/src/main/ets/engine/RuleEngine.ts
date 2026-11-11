import { fieldLabel, deviceLabel } from "@bundle:com.example.dormlink/entry/ets/models/Models";
import type { AutomationRule, DeviceState, EngineResult, Environment, ExecutionLog, RuleCondition } from "@bundle:com.example.dormlink/entry/ets/models/Models";
/** 独立于 ArkUI 和存储层的纯业务规则引擎，便于 Hypium 测试。 */
export class RuleEngine {
    static isValidEnvironment(env: Environment): boolean {
        return Number.isFinite(env.temperature) && env.temperature >= 0 && env.temperature <= 40 &&
            Number.isFinite(env.humidity) && env.humidity >= 0 && env.humidity <= 100 &&
            Number.isFinite(env.lux) && env.lux >= 0 && env.lux <= 1000;
    }
    static validateRule(rule: AutomationRule): string {
        if (rule.name.trim().length === 0 || rule.name.length > 24) {
            return '规则名称必须为1~24个字符';
        }
        if (!Number.isInteger(rule.priority) || rule.priority < 1 || rule.priority > 100) {
            return '优先级必须为1~100的整数';
        }
        if (['LIGHT', 'FAN', 'AC', 'CURTAIN'].indexOf(rule.targetDevice) < 0) {
            return '目标设备无效';
        }
        if (rule.action !== 'ON' && rule.action !== 'OFF') {
            return '设备动作无效';
        }
        if (rule.conditions.length < 1 || rule.conditions.length > 2) {
            return '每条规则需要1~2个条件';
        }
        for (let index: number = 0; index < rule.conditions.length; index++) {
            let cond: RuleCondition = rule.conditions[index];
            if (['temperature', 'humidity', 'lux'].indexOf(cond.field) < 0 ||
                ['>', '>=', '<', '<=', '=='].indexOf(cond.operator) < 0 ||
                !Number.isFinite(cond.value)) {
                return '条件字段、操作符或阈值无效';
            }
            if (cond.field === 'temperature' && (cond.value < 0 || cond.value > 40)) {
                return '温度阈值必须在0~40℃';
            }
            if (cond.field === 'humidity' && (cond.value < 0 || cond.value > 100)) {
                return '湿度阈值必须在0~100%';
            }
            if (cond.field === 'lux' && (cond.value < 0 || cond.value > 1000)) {
                return '照度阈值必须在0~1000lx';
            }
        }
        return '';
    }
    static readField(env: Environment, field: string): number {
        if (field === 'temperature') {
            return env.temperature;
        }
        if (field === 'humidity') {
            return env.humidity;
        }
        if (field === 'lux') {
            return env.lux;
        }
        throw new Error('无效的环境字段');
    }
    static matchesCondition(env: Environment, condition: RuleCondition): boolean {
        let value: number = RuleEngine.readField(env, condition.field);
        if (condition.operator === '>') {
            return value > condition.value;
        }
        if (condition.operator === '>=') {
            return value >= condition.value;
        }
        if (condition.operator === '<') {
            return value < condition.value;
        }
        if (condition.operator === '<=') {
            return value <= condition.value;
        }
        if (condition.operator === '==') {
            return value === condition.value;
        }
        throw new Error('无效的条件操作符');
    }
    static matches(env: Environment, rule: AutomationRule): boolean {
        if (!rule.enabled) {
            return false;
        }
        if (RuleEngine.validateRule(rule) !== '') {
            return false;
        }
        for (let i: number = 0; i < rule.conditions.length; i++) {
            if (!RuleEngine.matchesCondition(env, rule.conditions[i])) {
                return false;
            }
        }
        return true;
    }
    static explainConditions(rule: AutomationRule): string {
        let fragments: string[] = [];
        for (let i: number = 0; i < rule.conditions.length; i++) {
            let c: RuleCondition = rule.conditions[i];
            fragments.push(fieldLabel(c.field) + c.operator + c.value.toString());
        }
        return fragments.join(' 且 ');
    }
    /**
     * 按 priority 降序、id 字典序执行。设备“第一次命中的指令”锁定该轮控制权；
     * 后续命中同设备的规则记录 SKIPPED_CONFLICT，避免顺序不确定的覆盖。
     * 参数均不做原位修改。
     */
    static evaluate(env: Environment, rules: AutomationRule[], initialDevices: DeviceState[], currentTime: number): EngineResult {
        if (!RuleEngine.isValidEnvironment(env)) {
            throw new Error('环境数据超出范围');
        }
        let deviceCopies: DeviceState[] = initialDevices.map((item: DeviceState): DeviceState => {
            return { id: item.id, name: item.name, on: item.on };
        });
        let orderedRules: AutomationRule[] = rules.slice().sort((a: AutomationRule, b: AutomationRule): number => {
            if (a.priority !== b.priority) {
                return b.priority - a.priority;
            }
            if (a.id < b.id) {
                return -1;
            }
            if (a.id > b.id) {
                return 1;
            }
            return 0;
        });
        let touched: string[] = [];
        let history: ExecutionLog[] = [];
        let matched: number = 0;
        for (let index: number = 0; index < orderedRules.length; index++) {
            let rule: AutomationRule = orderedRules[index];
            if (!RuleEngine.matches(env, rule)) {
                continue;
            }
            let deviceIndex: number = deviceCopies.findIndex((item: DeviceState): boolean => item.id === rule.targetDevice);
            if (deviceIndex < 0) {
                continue;
            }
            matched++;
            let before: boolean = deviceCopies[deviceIndex].on;
            let after: boolean = rule.action === 'ON';
            let conflict: boolean = touched.indexOf(rule.targetDevice) >= 0;
            if (!conflict) {
                deviceCopies[deviceIndex].on = after;
                touched.push(rule.targetDevice);
            }
            let log: ExecutionLog = {
                id: 'L' + currentTime.toString() + '_' + matched.toString(),
                time: currentTime,
                order: matched,
                ruleId: rule.id,
                ruleName: rule.name,
                conditionText: RuleEngine.explainConditions(rule),
                targetDevice: rule.targetDevice,
                previousOn: before,
                nextOn: conflict ? before : after,
                status: conflict ? 'SKIPPED_CONFLICT' : 'APPLIED',
                message: conflict ? '同一轮该设备已被更高优先级规则控制，本条跳过' :
                    deviceLabel(rule.targetDevice) + '：' + (before ? '开' : '关') + ' → ' + (after ? '开' : '关')
            };
            history.push(log);
        }
        return { devices: deviceCopies, logs: history, matchedCount: matched };
    }
}
