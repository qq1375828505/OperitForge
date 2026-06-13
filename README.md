# OperitForge

自定义 Operit 资产仓库。

## 安装

复制 packages/*.js 到 /sdcard/Android/data/com.ai.assistance.operit/files/packages/
复制 skills/* 到 /sdcard/Download/Operit/skills/

## 包含内容

| 名称 | 类型 | 调用方式 |
|------|------|----------|
| agent_orchestrator | 工具包 | use_package |
| mimo_code | 工具包 | eval模式 |
| ecc | 技能 | 读取生效 |

## mimo_code 调用方法

use_package 暂不可用，使用 eval 模式：

package_proxy('operit_editor:debug_run_sandbox_script', {
  source_code: "var file=await Tools.Files.read('/sdcard/Android/data/com.ai.assistance.operit/files/packages/mimo_code.js');eval(file.content);var fnName=params.function||'mimo_search';var fnParams=params.params||{};var fnMap={mimo_search:mimo_search,mimo_read:mimo_read,mimo_explore:mimo_explore,mimo_understand:mimo_understand,mimo_glob:mimo_glob,mimo_edit:mimo_edit,mimo_write:mimo_write};if(fnMap[fnName]){complete(await fnMap[fnName](fnParams));}else{complete({success:false,message:'Unknown: '+fnName});}",
  params_json: '{"function":"mimo_search","params":{"path":"...","pattern":"..."}}',
  script_label: 'mimo',
  wait_ms: 60000
})

可用工具：mimo_search, mimo_read, mimo_explore, mimo_understand, mimo_glob, mimo_edit, mimo_write
