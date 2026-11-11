from pathlib import Path
from docx import Document
from docx.shared import Cm, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml import OxmlElement
from docx.text.paragraph import Paragraph
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.enum.text import WD_BREAK

ROOT = Path(__file__).resolve().parents[1]
src = ROOT / 'docs' / '课程个人报告模板_原件.docx'
out = ROOT / 'docs' / '鸿蒙高级应用开发工程师认证-20230313209-刘翔-期末大作业报告.docx'
doc = Document(str(src))
P = doc.paragraphs


def replace(p, content, size=10.5):
    p.text = content
    p.style = '学生正文规范'
    p.paragraph_format.space_after = Pt(7)
    p.paragraph_format.line_spacing = 1.32
    for r in p.runs:
        r.font.name = '宋体'
        r.font.size = Pt(size)
        r.font.color.rgb = RGBColor(28, 42, 61)
    return p


def set_cell(cell, content):
    cell.text = content
    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
    for p in cell.paragraphs:
        p.paragraph_format.space_after = Pt(2)
        for r in p.runs:
            r.font.size = Pt(9)
            r.font.name = '宋体'


def add_table_row(t, values):
    row = t.add_row()
    for i, content in enumerate(values):
        set_cell(row.cells[i], content)


def insert_after(anchor, text, style=None, monospace=False):
    el = OxmlElement('w:p')
    anchor._p.addnext(el)
    p = Paragraph(el, anchor._parent)
    p.style = style or '学生正文规范'
    p.paragraph_format.space_after = Pt(6)
    for line_idx, line in enumerate(text.split('\n')):
        if line_idx: p.add_run().add_break()
        run = p.add_run(line)
        run.font.name = 'Consolas' if monospace else '宋体'
        run.font.size = Pt(8.2 if monospace else 10.5)
        if monospace: run.font.color.rgb = RGBColor(33, 56, 94)
    return p


def picture_after(anchor, path, width_cm):
    newp = insert_after(anchor, '')
    newp.alignment = WD_ALIGN_PARAGRAPH.CENTER
    newp.paragraph_format.keep_together = True
    newp.add_run().add_picture(str(path), width=Cm(width_cm))
    return newp

P[11].text = '     学生姓名：          刘  翔'
P[12].text = '     学    号：          20230313209'

basic = [
    'DormLink——智能宿舍联动实验室',
    '联动实验室（主题三）',
    '刘翔（20230313209）',
    '【请填写真实GitHub用户名】',
    'https://github.com/【用户名】/DormLink（待发布）',
    '无（按独立完成方案设计；以本人实际开发提交为准）',
    'DevEco Studio + HarmonyOS SDK API 12；具体IDE版本/设备版本待实测'
]
for row_id, value in enumerate(basic, 1): set_cell(doc.tables[4].rows[row_id].cells[1], value)

replace(P[28],
'本项目选择课程主题三“联动实验室”，面向需要模拟宿舍自动化规则的学生和初学者。应用提供照明灯、风扇、空调、窗帘电机四类可控设备，以及温度、湿度、照度三项Mock环境数据。用户在“规则管理”中创建单条件或AND双条件规则，设定设备动作及优先级，然后在“环境演练”中切换盛夏/夜间场景或拖动滑杆，执行规则并查看设备状态变化与执行日志。业务主线为“编排→模拟→执行→解释→保存→恢复”，不是实验功能的机械拼接。系统不依赖服务器，也不连接真实IoT设备。')
replace(P[30],
'源码范围：已提供ArkUI环境页、规则页、日志页，四类设备手动开关，两组场景，规则新增/修改/启停/删除，双条件AND求值，优先级冲突跳过记录以及Preferences JSON快照保存/加载。规则引擎纯逻辑经Node/TypeScript同源预检12/12通过（详见evidence/tests/node_ts_logic_precheck.txt）。尚需在本人DevEco Studio环境中核对工程适配、模拟器编译和12条Hypium测试，且必须进行真实杀进程恢复与录屏。未验证的项目不可在报告中记为已经通过设备测试；本稿在提交前须补实际截图和运行结论。')
replace(P[33],
'采用Stage模型，入口EntryAbility加载Index.ets。表现层使用ArkUI组件与@State保持三项环境量、设备、规则和日志状态；业务层RuleEngine负责规则校验、双条件AND和优先级仲裁；模型层Models定义Environment、DeviceState、AutomationRule、ExecutionLog、AppSnapshot；数据层SnapshotRepository通过Preferences存取JSON快照。主数据流为“用户点击执行→Index收集当前环境/规则/设备→evaluate返回新的设备列表和执行日志→更新@State并刷新界面→save/flush保存”。图中模块按独立开发方案均标为本人责任范围，实际贡献以Git提交记录为准。')
replace(P[37],
'模块间只通过显式接口交换业务对象：Index调用RuleEngine.evaluate(environment, rules, devices, currentTime)，接收EngineResult；当用户修改环境、规则、设备或执行演练后，Index生成AppSnapshot传给Repository.save()。下次启动先调用load()再整体恢复页面状态。规则引擎不导入ArkUI和存储API，因此12条Hypium测试能直接使用Mock环境数组进行确定性断言。')
replace(P[39],
'本稿按个人独立开发安排，责任模块包括Models数据模型、RuleEngine规则引擎、SnapshotRepository本地存储、Index交互页面、Hypium自动化测试、需求文档和README。重点设计决定是把业务计算与页面分离，并将冲突定义为“单轮内按优先级首次控制设备，其后规则仅记跳过日志”，防止同一设备被不同规则反复覆盖。源码对应entry/src/main/ets/models、engine、data、pages及entry/src/test。最终个人贡献须使用本人的实际Git提交证明，不能以本报告文字代替。')
replace(P[42],
'核心业务为一次Mock环境驱动的联动演练。入口接收温度0~40℃、湿度0~100%、照度0~1000lx。RuleEngine先检查环境范围，再按priority降序和id升序遍历规则；未启用或条件未全部满足的规则不执行。命中规则若目标设备尚未被控制，应用ON/OFF并生成APPLIED日志；否则保持之前设备状态，生成SKIPPED_CONFLICT日志，明确冲突原因。最终返回新设备列表与执行记录。边界包括恰好达到>=阈值、AND一项为假、优先级相同；异常包括温度41℃、目标设备非法和优先级101。')
replace(P[48],
'validateRule(rule)在创建或修改规则时调用，返回空字符串表示校验成功；matches(env,rule)根据环境量计算是否满足单/双条件；evaluate(env,rules,devices,time)是一轮规则处理的唯一入口，返回EngineResult。Repository.load()读取快照或回退默认值，save(snapshot)先putSync再异步flush。规则列表编辑后并不会自动运行规则，用户须点击“执行一次联动演练”，使输入与输出能够复现并方便录屏核查。')
replace(P[51],
'核心文件：entry/src/main/ets/engine/RuleEngine.ets，RuleEngine.evaluate()。该方法解决“多个规则同时命中同一个设备时动作相互覆盖”的问题。先对规则进行稳定排序，再用touched数组表示本轮已取得设备控制权的目标设备。未占用时更新目标状态，占用时标记SKIPPED_CONFLICT；所有命中操作均写入包含命中条件、前后状态、顺序号的日志。下面展示与源码一致的关键实现片段（为排版省略部分初始化和日志字段）：')
replace(P[53],
'选择ArkUI @State而非直接修改控件：执行引擎产生新的DeviceState数组后赋值给@State，页面依赖声明式数据驱动刷新。选择Preferences是因为本项目数据量小、以配置为主，API10起已有getPreferencesSync/putSync，API12可通过异步flush持久化。其局限是无复杂查询能力、不适合敏感数据、不能用于多进程并发访问。官方API14参考还显示flushSync需API14，故API12工程不调用此接口。Hypium提供describe/it/expect，测试直接断言引擎而非静态截图。文档路径参见docs/资料核查记录.md。')
replace(P[59],
'测试采用固定Mock环境（例如33℃/82%/900lx）和4个默认设备，不连接真实传感器，保证输入可复现。12条自动化测试已经编写于entry/src/test/RuleEngine.test.ets：正常场景验证AND、禁用、冲突和输入不被修改；边界场景验证阈值等号、AND部分满足及同优先级ID排序；异常场景验证环境越界、非法设备、非法阈值和非法优先级。Node/TS同源逻辑运行预检已取得12/12 PASS；正式Hypium测试尚需在DevEco Studio运行并保留原始证据。')
replace(P[62],
'预检结果：在本环境使用TypeScript编译同源业务模块，再由Node.js assert运行TC01～TC12，控制台共12条PASS，见仓库evidence/tests/node_ts_logic_precheck.txt。此记录只能证明业务算法在Node/TS下符合测试断言，不是HarmonyOS Hypium实际结果。提交前须在DevEco右键运行List.test.ets，记录测试通过/失败数量、日志和截图，并替换下表“待运行”项目；若有失败，应保留原始错误信息并说明修复过程。')
replace(P[64],
'源码审查中发现一个真实的可靠性隐患：如果某次Preferences.flush()的Promise失败，后续保存若直接串在失败的Promise之后，then不会再次执行，可能导致后续操作持续无法落盘。处理方法是在每次串行flush之前对上一轮Promise执行catch恢复队列状态，再调用then开始当前flush，同时由Index.persist()向用户提示保存失败。修改位置：data/SnapshotRepository.ets，save()方法。该修正尚需通过设备存储异常模拟进一步验证，不能声称已完成真机故障复现。')
replace(P[67],
'建议用真实设备按顺序采集：①在环境页面调节温度、湿度、照度并观察四类设备；②进入规则页新增“温度≥28℃时关闭风扇”并设置P95；③返回“盛夏午后”运行，查看新规则优先执行、默认P90开风扇规则冲突跳过；④编辑新增规则为P20并再次执行，验证P90优先生效；⑤在日志页查看触发条件、顺序、设备变化及跳过原因。本报告暂未插入实际运行截图，必须由本人在DevEco模拟器/真机中拍摄后替换本占位文字。')
replace(P[70],
'以AutomationRule和ExecutionLog为代表性持久化数据：用户在Index编辑/演练产生AppSnapshot；SnapshotRepository.save()调用Preferences.putSync写入JSON字符串，再flush异步落盘；下次启动Index.aboutToAppear()通过load()恢复。计划验收：新增一条P95规则并执行，确认日志条数，然后完全结束应用进程、重启并逐项对比规则名称/优先级、环境值、设备状态与日志。代码具备保存恢复路径，但本稿不虚构设备端恢复成功证据，测试完成后需补“重启前/重启后”两张真实截图。')
replace(P[73],
'在本次设计和源码检查阶段，值得重点研究的问题是“为什么首选项写入后还要调用flush，以及不同API版本能否使用同步flush”。我首先阅读华为开发者《持久化用户首选项数据（ArkTS）》了解其轻量KV定位、应用沙箱和异步持久化，再对照《@ohos.data.preferences（用户首选项）》（API14）核查getPreferencesSync、putSync与flushSync的API起始版本。两份官方资料共同支持本项目在API12使用putSync+flush，并提醒不能把Preferences用于敏感数据或多进程并发；这也说明技术选型不能仅凭网上代码片段判断。为减少状态流转耦合，我将RuleEngine设计成纯函数，并根据官方Hypium使用指导组织12条Mock断言。下一步要在本人安装的DevEco Studio中记录实际SDK版本，执行全部测试、主动结束进程验证恢复，并比较API12异步flush与API14同步flush在行为和异常处理方面的区别；如后续需要大量日志查询，将进一步学习官方RDB开发指南并用具体查询耗时判断是否迁移。资料名称与URL已列在docs/资料核查记录.md，最终个人总结应结合本人真实调试过程补充。')

# Tables 2.1, 3.1, 3.2, 4.1, 5.1
module_rows = [
 ('数据模型','字段约束、默认规则与设备','defaultSnapshot()→AppSnapshot','刘翔（待核验）'),
 ('规则引擎','AND求值、排序和设备仲裁','evaluate()→EngineResult','刘翔（待核验）'),
 ('持久化仓储','Preferences保存与重启恢复','save()/load()→Snapshot','刘翔（待核验）'),
 ('ArkUI页面','环境/规则/日志交互','事件→@State刷新','刘翔（待核验）'),
 ('自动化测试','正常边界异常12条','Mock→断言结果','刘翔（待核验）')
]
for i, row in enumerate(module_rows):
    if i < 3:
        for j,v in enumerate(row): set_cell(doc.tables[5].rows[i+1].cells[j],v)
    else: add_table_row(doc.tables[5],row)

model_rows = [
 ('Environment','temperature/humidity/lux:number','温湿光环境模拟','@State与快照JSON'),
 ('DeviceState','id/name:string,on:boolean','四类设备状态','@State与快照JSON'),
 ('AutomationRule','priority:number,conditions:RuleCondition[]','规则启停、AND及控制动作','@State与快照JSON'),
 ('ExecutionLog','order/status/previousOn/nextOn','动作及冲突审计','最多100条，JSON'),
 ('AppSnapshot','version:1,rules/devices/logs','完整恢复单元','Preferences单键读写')
]
for i,row in enumerate(model_rows):
    if i < 2:
        for j,v in enumerate(row): set_cell(doc.tables[6].rows[i+1].cells[j],v)
    else: add_table_row(doc.tables[6],row)

api_rows = [
 ('validateRule','rule:AutomationRule','字符串（空=合法）','名称/优先级/阈值非法拒绝'),
 ('matches','env,rule','boolean','未启用/AND一项假→false'),
 ('evaluate','env,rules,devices,time','EngineResult','环境越界抛错；冲突跳过'),
 ('load','无','AppSnapshot','坏JSON回退默认快照'),
 ('save','snapshot:AppSnapshot','Promise<void>','flush异常向页面传播'),
 ('saveRule','编辑表单字段','更新规则与存档','阈值/优先级校验提示')
]
for i,row in enumerate(api_rows):
    if i < 2:
        for j,v in enumerate(row): set_cell(doc.tables[7].rows[i+1].cells[j],v)
    else: add_table_row(doc.tables[7],row)

commit_rows = [
 ('【待git log】','模型+需求说明书','models/Models.ets；docs/软件需求说明书.md'),
 ('【待git log】','规则引擎+自动化测试','engine/RuleEngine.ets；entry/src/test'),
 ('【待git log】','ArkUI+Preferences+录屏','pages/Index.ets；data/SnapshotRepository.ets')
]
for i,row in enumerate(commit_rows):
    for j,v in enumerate(row):set_cell(doc.tables[8].rows[i+1].cells[j],v)

cases = [
 ('正常','33℃/82%，AND全满足；两条冲突规则','风扇ON；高优先级控制，低优先级跳过','Node预检PASS；Hypium待运行/截图'),
 ('边界','温度28℃（>=28）；同优先级ID不同','阈值边界触发；ID升序优先','Node预检PASS；Hypium待运行/截图'),
 ('异常','41℃；50℃温度阈值；非法设备/优先级','异常拒绝处理并给出明确信息','Node预检PASS；Hypium待运行/截图')
]
for i,row in enumerate(cases):
    for j,v in enumerate(row):set_cell(doc.tables[9].rows[i+1].cells[j],v)

# Key code excerpt from the actual implementation.
code = '''let orderedRules: AutomationRule[] = rules.slice().sort((a, b) => {
  if (a.priority !== b.priority) { return b.priority - a.priority; }
  return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
});
// 对命中的规则逐一判断：
let conflict: boolean = touched.indexOf(rule.targetDevice) >= 0;
if (!conflict) {
  deviceCopies[deviceIndex].on = (rule.action === 'ON');
  touched.push(rule.targetDevice);
}
// status = conflict ? 'SKIPPED_CONFLICT' : 'APPLIED';'''
insert_after(P[51], code, monospace=True)

# Add diagrams directly after explanation paragraphs.
picture_after(P[33], ROOT / 'docs' / 'architecture.png', 14.5)
picture_after(P[42], ROOT / 'docs' / 'rule_flow.png', 9.2)

P[68].text = '图6.1  应用运行效果（待替换为实际模拟器/真机截图）'
P[71].text = '图6.2  数据恢复与集成结果（待插入真实重启前后截图）'

# Visibly mark evidence placeholders, preventing accidental submission as finished proof.
for i in (68,71):
    P[i].alignment = WD_ALIGN_PARAGRAPH.CENTER
    for run in P[i].runs:
        run.font.color.rgb = RGBColor(170, 52, 47)

P[10].text = '     班    级：          23物联2班'
for _i in (10, 11, 12):
    P[_i].paragraph_format.left_indent = Cm(0.65)

# Footer/page numbers retained from the teacher's original template.
doc.core_properties.title='DormLink 联动实验室 — 期末大作业个人报告（待验证草稿）'
doc.core_properties.subject='鸿蒙高级应用开发工程师认证'
doc.core_properties.author='学生报告草稿（待本人确认）'
doc.save(str(out))
print(out)
