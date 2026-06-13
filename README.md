# OperitForge

自定义 Operit 资产仓库，包含工具包和技能。

## 包含内容

### 工具包 (packages/)

| 包名 | 说明 | 调用方式 |
|------|------|----------|
| agent_orchestrator.js | AI皇权编排器（23个工具） | use_package |
| mimo_code.js | MiMo代码工具（7个工具） | eval模式（见下方） |

### 技能 (skills/)

| 技能名 | 说明 |
|--------|------|
| ecc | ECC代码审查技能 |

## 快速安装

复制 packages/*.js 到 /sdcard/Android/data/com.ai.assistance.operit/files/packages/

复制 skills/* 到 /sdcard/Download/Operit/skills/

重启 Operit

## mimo_code 使用方法

因 Operit 平台 bug，use_package 暂不可用。使用 eval 模式调用：

调用方式：operit_editor:debug_run_sandbox_script

source_code 固定为：
```js
var file = await Tools.Files.read('/sdcard/Android/data/com.ai.assistance.operit/files/packages/mimo_code.js');
eval(file.content);
var fnName = params.function || 'mimo_search';
var fnParams = params.params || {};
var fnMap = {mimo_search:mimo_search, mimo_read:mimo_read, mimo_explore:mimo_explore, mimo_understand:mimo_understand, mimo_glob:mimo_glob, mimo_edit:mimo_edit, mimo_write:mimo_write};
if (fnMap[fnName]) { complete(await fnMap[fnName](fnParams)); } else { complete({success:false, message:'Unknown: '+fnName}); }
```

params_json 指定函数和参数：
```json
{"function":"mimo_search","params":{"path":"项目路径","pattern":"正则","include":"*.kt"}}
```

## 可用工具

| 工具 | 功能 | 参数 |
|------|------|------|
| mimo_search | 代码搜索+上下文 | path, pattern, include |
| mimo_read | 智能读取+符号标注 | path, offset, limit |
| mimo_explore | 深度理解：签名+定义+引用+调用者+类成员 | path, symbol, include |
| mimo_understand | 文件结构分析 | path |
| mimo_glob | 文件查找 | path, pattern |
| mimo_edit | 代码编辑 | path, old, new |
| mimo_write | 文件写入 | path, content, append |
