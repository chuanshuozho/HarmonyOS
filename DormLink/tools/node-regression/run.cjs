/** 仅为 RuleEngine 的 Node/TypeScript 逻辑预检；不可替代 Hypium 设备测试。 */
const assert = require('node:assert/strict');
const { RuleEngine } = require('./dist/engine/RuleEngine.js');
const { defaultDevices, defaultRules } = require('./dist/models/Models.js');
const hot = { temperature:33, humidity:82, lux:900 };
const r = (id,p,act)=>({id, name:'温度联动'+id, enabled:true, priority:p,
 conditions:[{field:'temperature',operator:'>=',value:28}],targetDevice:'FAN',action:act});
const checks = [
 ['TC01_AND_both_true',()=>{const x=RuleEngine.evaluate(hot,[defaultRules()[0]],defaultDevices(),1000);assert.equal(x.matchedCount,1);assert.equal(x.devices[1].on,true);assert.equal(x.logs[0].status,'APPLIED');}],
 ['TC02_AND_one_false',()=>{const x=RuleEngine.evaluate({...hot,humidity:69},[defaultRules()[0]],defaultDevices(),1000);assert.equal(x.matchedCount,0);assert.equal(x.devices[1].on,false);}],
 ['TC03_conflict_priority',()=>{const x=RuleEngine.evaluate(hot,[r('R9',30,'OFF'),r('R8',90,'ON')],defaultDevices(),1000);assert.equal(x.devices[1].on,true);assert.equal(x.logs[0].ruleId,'R8');assert.equal(x.logs[1].status,'SKIPPED_CONFLICT');assert.equal(x.logs[1].nextOn,true);}],
 ['TC04_tie_id_order',()=>{const x=RuleEngine.evaluate(hot,[r('R2',50,'OFF'),r('R1',50,'ON')],defaultDevices(),1000);assert.equal(x.logs[0].ruleId,'R1');assert.equal(x.devices[1].on,true);}],
 ['TC05_disabled_rule',()=>{const z=r('R11',99,'ON');z.enabled=false;assert.equal(RuleEngine.evaluate(hot,[z],defaultDevices(),1000).matchedCount,0);}],
 ['TC06_threshold_equal',()=>{assert.equal(RuleEngine.evaluate({...hot,temperature:28},[r('R1',30,'ON')],defaultDevices(),1000).matchedCount,1);}],
 ['TC07_invalid_environment',()=>{assert.throws(()=>RuleEngine.evaluate({...hot,temperature:41},[],defaultDevices(),1000));}],
 ['TC08_invalid_threshold',()=>{const z=r('R1',20,'ON');z.conditions[0].value=50;assert.equal(RuleEngine.validateRule(z),'温度阈值必须在0~40℃');}],
 ['TC09_invalid_device',()=>{const z=r('R1',20,'ON');z.targetDevice='DOOR';assert.equal(RuleEngine.validateRule(z),'目标设备无效');}],
 ['TC10_no_mutate_input',()=>{const ds=defaultDevices();const x=RuleEngine.evaluate(hot,[r('R1',20,'ON')],ds,1000);assert.equal(ds[1].on,false);assert.equal(x.devices[1].on,true);}],
 ['TC11_logs_sequence',()=>{const x=RuleEngine.evaluate(hot,defaultRules(),defaultDevices(),1000);assert.equal(x.logs.length,2);assert.equal(x.logs[0].order,1);assert.equal(x.logs[1].order,2);}],
 ['TC12_invalid_priority',()=>{assert.equal(RuleEngine.validateRule(r('R1',101,'ON')),'优先级必须为1~100的整数');}],
];
let passed=0;
for (const [name, fn] of checks) {try{fn();console.log('PASS '+name);passed++;}catch(e){console.error('FAIL '+name+': '+e.message);}}
console.log(`${passed}/${checks.length} PASS (Node/TS mirror; NOT Hypium evidence)`);
if (passed !== checks.length) process.exitCode = 1;
