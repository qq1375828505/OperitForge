---
name: terminal-optimizer
description: 终端操作优化技能 - 自动注入超时、工具选择、错误处理等规则
version: 1.0.0
author: AAswordman
tags: terminal, optimization, shell, ubuntu
---

# Terminal Optimizer Skill

## 核心规则（强制执行）

### 1. 超时设置规范
- **永远显式指定 `timeoutMs` 参数**
- 短命令（文件操作、ls）：`timeoutMs=5000-10000`
- 编译/构建：`timeoutMs=120000-300000`
- 服务器启动：使用 `background=true`
- 网络请求：`timeoutMs=15000-30000`

### 2. 工具选择优先级
| 操作类型 | 优先工具 | 避免使用 |
|----------|----------|----------|
| 文件读写 | `read_file` / `create_file` / `edit_file` | `cat` / `echo` / `sed` |
| 文件复制/移动 | `copy_file` / `move_file` | `cp` / `mv` |
| 目录浏览 | `list_files` | `ls -la` |
| 文件搜索 | `find_files` | `find` |
| 内容搜索 | `grep_code` / `grep_context` | `grep -r` |
| 网络测试 | `curl -I --connect-timeout 5` | `ping` |
| 系统信息 | 读取 `/proc` 文件 | `free` / `top` |

### 3. 长任务处理
```bash
# 启动后台任务
terminal("npm run build", background=true, timeoutMs=1000)

# 等待完成
terminal_wait(timeoutMs=300000)

# 查看输出
terminal_getscreen()
```

### 4. 错误处理流程
1. 检查返回值中的 `timedOut` 标志
2. 检查 `exitCode` 是否为 0
3. 超时时立即发送 Ctrl+C：
   ```bash
   terminal_input(control="ctrl", input="c")
   ```

## 环境信息

### 基础配置
- 操作系统：Ubuntu 24 (proot)
- 架构：aarch64
- Python：3.12.3
- 包管理：apt

### 已安装工具清单
```bash
# 系统监控
ps htop free

# 网络工具
ping curl wget ifconfig net-tools

# 开发工具
git vim nano tree jq python3
```

### 安装缺失工具
```bash
apt update && apt install -y <package-name>
```

## 常用命令模板

### 系统监控
```bash
# 进程查看
ps aux | grep <process_name>

# 内存使用
cat /proc/meminfo | head -5

# 磁盘空间
df -h /storage/emulated/0

# 目录大小
du -sh <directory>
```

### 网络诊断
```bash
# HTTP 连接测试
curl -sI --connect-timeout 5 https://example.com | head -3

# DNS 解析
nslookup <domain>

# 连通性测试
ping -c 3 8.8.8.8

# 端口检查
netstat -tuln | grep <port>
```

### 文件操作
```bash
# 查找文件
find /path -name "*.py" -type f

# 搜索内容
grep -rn "pattern" /path --include="*.kt"

# 权限修改
chmod +x <file>

# 文件信息
file <filename>
```

## 问题诊断流程

### 超时问题
1. 增加 `timeoutMs` 值
2. 使用 `background=true` + `terminal_wait`
3. 检查命令是否需要交互输入

### 网络问题
1. 测试 DNS：`nslookup google.com`
2. 测试连通：`ping -c 2 8.8.8.8`
3. 测试 HTTP：`curl -I --connect-timeout 5 https://baidu.com`

### 权限问题
1. 检查文件权限：`ls -la <file>`
2. 修改权限：`chmod +x <file>`
3. 检查目录访问：`test -d <dir> && echo "OK"`

### 内存/空间问题
1. 检查内存：`cat /proc/meminfo | head -10`
2. 检查磁盘：`df -h`
3. 清理缓存：`apt clean`

## 快速健康检查

执行以下命令序列验证环境：
```bash
# 1. 检查基础工具
which ps && which curl && which git && which python3

# 2. 检查网络
ping -c 2 8.8.8.8

# 3. 检查存储
df -h /storage/emulated/0

# 4. 检查内存
cat /proc/meminfo | head -3
```

## 注意事项

1. **禁止使用 `set -e`** - 会导致终端会话直接退出并卡死
2. **避免管道满屏输出** - 使用 `head`/`tail` 限制输出行数
3. **长输出截断** - 超过 100 行的输出应保存到文件再读取
4. **交互式命令** - 需要用户输入的命令使用 `interactive=true`