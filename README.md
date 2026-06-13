# OperitForge

自定义 Operit 资产仓库，包含工具包和技能。

克隆到设备后，按说明安装即可使用。

## 包含内容

### 工具包 (packages/)

| 包名 | 说明 | 安装路径 |
|------|------|----------|
| `agent_orchestrator.js` | AI皇权编排器 - 多Agent任务处理系统 | `/sdcard/Android/data/com.ai.assistance.operit/files/packages/` |

### 技能 (skills/)

| 技能名 | 说明 | 安装路径 |
|--------|------|----------|
| `ecc` | ECC代码审查技能 | `/sdcard/Download/Operit/skills/ecc/` |
| `terminal-optimizer` | 终端操作优化技能 | `/sdcard/Download/Operit/skills/terminal-optimizer/` |

## 快速安装

```bash
# 克隆仓库
git clone https://github.com/qq1375828505/OperitForge.git
cd OperitForge

# 安装工具包
cp packages/agent_orchestrator.js /sdcard/Android/data/com.ai.assistance.operit/files/packages/

# 安装技能
cp -r skills/ecc /sdcard/Download/Operit/skills/
cp -r skills/terminal-optimizer /sdcard/Download/Operit/skills/
```

安装后重启 Operit 即可生效。
