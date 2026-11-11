// 仪器测试入口复用与 Local Unit Test 相同的 12 个测试逻辑。
// 某些 DevEco Studio 版本默认仅识别 src/test/；优先运行 src/test/List.test.ets。
import ruleEngineTest from '../../../test/RuleEngine.test';
export default function instrumentRuleEngineTest() {
  ruleEngineTest();
}
