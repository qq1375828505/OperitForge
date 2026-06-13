# Operit Terminal Optimizer Skill

一个 Operit AI 的终端操作优化技能，解决终端卡死、超时、工具选择不当等问题。

## 功能

- 🕐 **超时规范** - 自动注入超时设置规则，防止命令卡死
- 🛠️ **工具选择** - 优先使用专用工具，避免不必要的终端命令
- 🔄 **错误处理** - 超时自动中断，防止会话挂起
- 📋 **环境检测** - 内置健康检查和环境初始化脚本

## 安装方式

### 方式一：直接下载
```bash
# 克隆仓库
git clone https://github.com/AAswordman/operit-terminal-skill.git

# 复制到 Operit skills 目录
cp -r operit-terminal-skill /sdcard/Download/Operit/skills/terminal-optimizer
```

### 方式二：从 GitHub 导入
在 Operit 的 Skill 管理页面，输入 GitHub 仓库地址：
```
https://github.com/AAswordman/operit-terminal-skill
```

## 使用方法

1. 安装后，重启 Operit
2. 在 Skill 管理页面启用 `terminal-optimizer`
3. AI 会自动读取技能文件中的优化规则

## 包含文件

```
operit-terminal-skill/
├── SKILL.md                    # 技能主文件（核心规则）
├── README.md                   # 本文件
├── scripts/
│   ├── health_check.sh         # 环境健康检查脚本
│   └── setup_env.sh            # 环境初始化脚本
└── examples/
    └── terminal_commands.md    # 常用命令参考
```

## 核心规则

### 超时设置
| 命令类型 | 推荐超时 |
|----------|----------|
| 文件操作 | 5-10 秒 |
| 编译构建 | 2-5 分钟 |
| 服务器启动 | 后台运行 |

### 工具选择
| 操作 | 用这个 | 别用这个 |
|------|--------|----------|
| 读文件 | `read_file` | `cat` |
| 搜索代码 | `grep_code` | `grep -r` |
| 列目录 | `list_files` | `ls -la` |

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License