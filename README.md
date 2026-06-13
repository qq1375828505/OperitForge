# OperitForge

自定义 Operit 资产仓库，包含工具包和技能。

## 包含内容

### 工具包 (packages/)

| 包名 | 说明 | 调用方式 | 安装路径 |
|------|------|----------|----------|
| `agent_orchestrator.js` | AI皇权编排器 | `use_package` | `/sdcard/Android/data/com.ai.assistance.operit/files/packages/` |
| `mimo_code.js` | MiMo代码工具 | `debug_run_sandbox_script` | 同上 |

### 技能 (skills/)

| 技能名 | 说明 | 安装路径 |
|--------|------|----------|
| `ecc` | ECC代码审查技能 | `/sdcard/Download/Operit/skills/` |
| `terminal-optimizer` | 终端操作优化技能 | 同上 |

## 快速安装

```bash
git clone https://github.com/qq1375828505/OperitForge.git
cd OperitForge

# 工具包
cp packages/agent_orchestrator.js /sdcard/Android/data/com.ai.assistance.operit/files/packages/
cp packages/mimo_code.js /sdcard/Android/data/com.ai.assistance.operit/files/packages/

# 技能
cp -r skills/* /sdcard/Download/Operit/skills/
```

## mimo_code 使用方法

通过 `debug_run_sandbox_script` 调用（因 Operit 平台 bug，`use_package` 暂不可用）：

```
source_path: /sdcard/Android/data/com.ai.assistance.operit/files/packages/mimo_code.js
params_json: {"function":"mimo_search","params":{"path":"项目路径","pattern":"正则","include":"*.kt"}}
```

### 可用工具

| 工具 | 功能 | 参数 |
|------|------|------|
| `mimo_search` | 代码搜索+上下文 | path, pattern, include |
| `mimo_read` | 智能读取+符号标注 | path, offset, limit |
| `mimo_explore` | 深度理解：签名+定义+引用+调用者+类成员 | path, symbol, include |
| `mimo_understand` | 文件结构分析 | path |
| `mimo_glob` | 文件查找 | path, pattern |
| `mimo_edit` | 代码编辑 | path, old, new |
| `mimo_write` | 文件写入 | path, content, append |
