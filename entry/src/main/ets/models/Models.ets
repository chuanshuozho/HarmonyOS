/** 联动实验室核心业务数据模型。所有业务数据均是可 JSON 序列化的简单对象。 */
export interface Environment {
  temperature: number; // 摄氏度，0 ~ 40
  humidity: number; // 相对湿度，0 ~ 100
  lux: number; // 模拟照度，0 ~ 1000 lx
}

export interface DeviceState {
  id: string;  // LIGHT / FAN / AC / CURTAIN
  name: string;
  on: boolean;
}

export interface RuleCondition {
  field: string; // temperature / humidity / lux
  operator: string; // >, >=, <, <=, ==
  value: number;
}

export interface AutomationRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number; // 1 ~ 100；数值越高越先执行
  conditions: RuleCondition[]; // 1 或 2 条条件，双条件按 AND 连接
  targetDevice: string;
  action: string; // ON / OFF
}

export interface ExecutionLog {
  id: string;
  time: number;
  order: number;
  ruleId: string;
  ruleName: string;
  conditionText: string;
  targetDevice: string;
  previousOn: boolean;
  nextOn: boolean;
  status: string; // APPLIED / SKIPPED_CONFLICT
  message: string;
}

export interface EngineResult {
  devices: DeviceState[];
  logs: ExecutionLog[];
  matchedCount: number;
}

export interface AppSnapshot {
  version: number;
  environment: Environment;
  devices: DeviceState[];
  rules: AutomationRule[];
  logs: ExecutionLog[];
  nextRuleId: number;
}

export function defaultDevices(): DeviceState[] {
  return [
    { id: 'LIGHT', name: '照明灯', on: false },
    { id: 'FAN', name: '风扇', on: false },
    { id: 'AC', name: '空调', on: false },
    { id: 'CURTAIN', name: '窗帘电机', on: false }
  ];
}

export function defaultRules(): AutomationRule[] {
  return [
    {
      id: 'R1', name: '闷热自动通风', enabled: true, priority: 90,
      conditions: [
        { field: 'temperature', operator: '>=', value: 28 },
        { field: 'humidity', operator: '>=', value: 70 }
      ], targetDevice: 'FAN', action: 'ON'
    },
    {
      id: 'R2', name: '天暗自动开灯', enabled: true, priority: 80,
      conditions: [{ field: 'lux', operator: '<', value: 250 }],
      targetDevice: 'LIGHT', action: 'ON'
    },
    {
      id: 'R3', name: '强光关闭窗帘', enabled: true, priority: 70,
      conditions: [{ field: 'lux', operator: '>=', value: 800 }],
      targetDevice: 'CURTAIN', action: 'ON'
    },
    {
      id: 'R4', name: '低温关闭空调', enabled: true, priority: 60,
      conditions: [{ field: 'temperature', operator: '<=', value: 20 }],
      targetDevice: 'AC', action: 'OFF'
    }
  ];
}

export function defaultSnapshot(): AppSnapshot {
  return {
    version: 1,
    environment: { temperature: 25, humidity: 55, lux: 550 },
    devices: defaultDevices(),
    rules: defaultRules(),
    logs: [],
    nextRuleId: 5
  };
}

export function deviceLabel(id: string): string {
  if (id === 'LIGHT') { return '照明灯'; }
  if (id === 'FAN') { return '风扇'; }
  if (id === 'AC') { return '空调'; }
  if (id === 'CURTAIN') { return '窗帘电机'; }
  return '未知设备';
}

export function fieldLabel(field: string): string {
  if (field === 'temperature') { return '温度'; }
  if (field === 'humidity') { return '湿度'; }
  if (field === 'lux') { return '照度'; }
  return '未知环境量';
}
