# DormLink 联动实验室

**HarmonyOS 主题三期末大作业 · ArkTS / ArkUI / Preferences / Hypium**

> 交付状态：完整的课程项目源码与文档草稿，**尚未在用户设备上完成 DevEco Studio 编译、模拟器/真机运行、测试或录屏**。请根据下述操作验收，并把真实结果补入仓库和个人报告。

## 1. 环境与运行

推荐：华为 **DevEco Studio** 带 HarmonyOS SDK，建 **Stage / ArkTS / Phone / Empty Ability** 工程。此仓库配套采用 **HarmonyOS API 12** 和 `modelVersion: 5.0.0`。在不同 DevEco 版本中工程模板配置可能有差异；如果 IDE Sync 提示 Hvigor/modelVersion 不匹配，**以你本机新建的 API12 空工程为准**，将此仓库 `entry/src/main/ets`、`entry/src/main/resources`、`entry/src/test`、`entry/src/ohosTest/ets/test` 源文件复制覆盖到新工程中，保留新模板的构建工具文件，并把 `@ohos/hypium: 1.0.25` 加入 `oh-package.json5`。

1. File → Open 选择 `DormLink` 根目录；等待 Sync，按 IDE 提示配置 SDK、签名和虚拟机。
2. 选择默认的 `entry` 模块和手机模拟器/真机，点击 Run。
3. 首次启动：显示 4 类设备、3个环境参数、4条规则（含一条 AND 双条件）。
4. 运行测试：在 `entry/src/test/List.test.ets` 右键选择 Run Test，预期 12 条；**需要截图真实运行结果**。
5. 如测试文件结构不适用于所装 DevEco，使用 IDE 的 New → Test → Local Unit Test 生成测试模块，再移植 `RuleEngine.test.ets`，不可虚报通过。

目标 API 12 的 `getPreferencesSync`、`putSync`、`flush` 均按官方资料选择。工具链因人而异，**不保证免配置一步运行**。

## 2. 主要功能

- **环境模拟**：温度 0~40℃、湿度0~100%、照度0~1000lx 滑杆；两组一键场景：“盛夏午后”“夜间降温”。
- **设备管理**：照明灯、风扇、空调、窗帘电机四类开关，可以手动开关。
- **规则编辑**：新增、修改、启停、删除规则，支持单条件或两条件 AND、数值阈值、五种比较运算符和优先级1~100。
- **规则引擎**：对真实输入求值，按 priority 降序、ID升序执行，锁定每轮第一个命中设备动作。冲突的后续动作跳过并记录原因。
- **日志与持久化**：记录条件、执行次序、前后设备状态、冲突，最近100条；状态以 AppSnapshot JSON 存入 Preferences，存盘异步 flush。
- **自动化测试**：12条 Hypium 断言覆盖正常/边界/异常，另外附人工杀进程恢复操作表。

## 3. 操作闭环（推荐录屏）

打开 App → 规则管理 → 新建规则“高温关风扇”，条件温度≥28、优先级P95 → 环境演练 → 盛夏午后 → 执行 → 日志记录 P95 关风扇 + P90 开风扇冲突跳过 → 编辑新规则把 P95 改为 P20 → 再次演练 → 日志记录 P90 风扇开 + P20 风扇关冲突跳过 → 强制结束进程 → 重启 → 原规则、设备、环境和日志仍存在。

## 4. 目录结构

```text
DormLink/
├─ AppScope/app.json5
├─ entry/src/main/ets/
│  ├─ entryability/EntryAbility.ets   # Stage入口
│  ├─ pages/Index.ets                 # ArkUI页面与交互
│  ├─ models/Models.ets               # 状态、规则、设备模型
│  ├─ engine/RuleEngine.ets           # 纯业务条件求值与优先级
│  └─ data/SnapshotRepository.ets     # Preferences存档仓储
├─ entry/src/test/                   # 12条Hypium本地测试
├─ entry/src/ohosTest/ets/test/       # 仪器测试转接入口
├─ docs/软件需求说明书.md
├─ docs/测试与证据清单.md
├─ docs/资料核查记录.md
└─ evidence/                         # 留给真机/模拟器真实证据
```

## 5. 设计选择与边界

规则引擎是**用户点击执行才运行**的 Mock 模拟器，不会持续在后台监测传感器。优先级策略是“每轮首次控制权锁定”，即使高优先级规则的动作与设备当前状态一致，也会阻止同轮低优先级反向覆盖，确保可解释。比较运算符支持 `> >= < <= ==`；双条件仅AND。

Preferences 用于小型本地配置和最多100条日志，**不适用于敏感信息、海量日志或多进程写**。数据损坏时回退默认快照，不保证恢复已损坏部分。

## 6. GitHub提交和个人证明

开发者必须使用自己账号创建 GitHub 仓库，实际 Git commit 建议：

```bash
git init
git add .
git commit -m "feat: define dorm automation models and specification"
git branch -M main
git remote add origin https://github.com/<YOUR_ACCOUNT>/DormLink.git
git push -u origin main
```

之后每次真实修改都单独 commit。**不要把示例命令或编造的哈希填成真实贡献记录**。请在期末提交的学习通答案处填写：

```text
GitHub仓库链接：https://github.com/<YOUR_ACCOUNT>/DormLink
本人GitHub账号名称：<YOUR_ACCOUNT>
```

若缺任一项，按课上规则成绩计0分。学号、姓名、提交账号请与个人报告一致。

## 7. 证据与提交清单

详见 `docs/测试与证据清单.md`。项目需要真实截图（至少环境页、规则页、冲突日志、重启恢复、测试结果）、真实演示视频 `evidence/demo.mp4`、能复现的 Git 提交历史和 Word 个人报告。`evidence/` 当前只包含指引，不包含伪造运行截图。

## 8. 技术资料

- [官方：ArkTS Stage工程结构](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides-v5/start-with-ets-stage-V5/)
- [官方：Preferences持久化指南](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/data-persistence-by-preferences/)
- [官方：Preferences API参考（API14）](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V14/js-apis-data-preferences-V14/)
- [官方：Hypium测试指南](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/unittest-guidelines/)
- [官方：测试运行指导](https://developer.huawei.com/consumer/en/doc/harmonyos-guides/ide-instrument-test/)

## 9. 截图索引（完成真实运行后补充）

| 画面 | 预定保存路径 | 证据状态 |
| --- | --- | --- |
| 环境、设备面板 | `evidence/screenshots/01_environment.png` | 待拍摄 |
| 规则管理 | `evidence/screenshots/02_rules.png` | 待拍摄 |
| 双条件编辑 | `evidence/screenshots/03_editor.png` | 待拍摄 |
| 高低优先级冲突日志 | `evidence/screenshots/04_conflict.png` | 待拍摄 |
| 重启后恢复 | `evidence/screenshots/05_recovered.png` | 待拍摄 |
| Hypium真实测试 | `evidence/tests/06_hypium.png` | 待运行 |

报告目录根据老师原始Word模板保留；新增内容可能导致页码变化，**最终请在Word中更新目录和图表编号**。
