# ECC Skill

> 通用代码审查技能，基于 ECC 标准，适配 Operit 环境。

## 使用方式

在对话中说："审查这段代码"、"review 一下 XXX 文件"、"按 ECC 标准审核"，然后提供：
- 文件路径（可以是本地工作区文件或 git diff 输出）
- 或者直接粘贴代码片段

---

## 审查流程

1. **收集上下文** — 读取目标文件全文，理解 imports、依赖、调用关系
2. **确定范围** — 哪些文件改了、改了什么功能、怎么关联的
3. **逐项审查** — 从 CRITICAL 到 LOW 依次检查
4. **输出报告** — 用下方格式汇报，只报 >80% 确信是真问题的项

---

## 置信度过滤

**只报真问题，不灌水：**

- **报告**：>80% 确信是真问题
- **跳过**：风格偏好（除非违反项目规范）
- **跳过**：未改代码的问题（除非是 CRITICAL 安全漏洞）
- **合并**：同类问题（如"5个函数缺错误处理"合为1条）
- **优先**：能导致 bug、安全漏洞、数据丢失的问题

### 报告前四问

写发现前必须回答，任一为"否"或"不确定"则降级或删除：

1. **能指出具体行号吗？** — 文件名+行号，模糊描述直接删
2. **能描述具体故障模式吗？** — 输入、状态、坏结果，说不出触发条件就是猜测
3. **读过上下文了吗？** — 调用者、imports、测试，很多问题在上一层已处理
4. **严重级别站得住吗？** — 缺 JSDoc 永远不是 HIGH，单个 `any` 永远不是 CRITICAL

### HIGH/CRITICAL 需要证据

必须包含：
- 精确代码片段和行号
- 具体故障场景：输入、状态、结果
- 为什么现有防护（类型、验证、框架默认值）没挡住

三个都有才能定 HIGH/CRITICAL，否则降为 MEDIUM 或删。

### 零发现是正常结果

代码没问题就报零。不要为了显得严格而编造问题。LLM 审查的最大失败模式就是编造发现。

---

## 常见误报 — 直接跳过

LLM 审查器经常误判的模式，除非有本项目具体证据否则不报：

- **"建议加错误处理"** — 调用者或框架层已处理（Express 中间件、React ErrorBoundary、Promise .catch）
- **"缺少输入校验"** — 内部函数且调用者已校验，先追一个调用者再报
- **"魔法数字"** — 常见常量：`200`、`404`、`1000`ms、`60`、`24`、`1024`、数组下标 `0`/`-1`
- **"函数太长"** — 穷举 switch、配置对象、测试表、生成代码，长度不等于复杂度
- **"缺 JSDoc"** — 命名和签名已自描述的内部辅助函数
- **"用 const 代替 let"** — 变量被重新赋值时，先读完整函数
- **"可能空指针"** — 前一行已收窄类型或有 `if` 守卫
- **"N+1 查询"** — 固定基数循环（如4元素枚举）或已用 DataLoader/批处理
- **"缺 await"** — 故意 fire-and-forget 的调用（日志、指标、后台队列），看有没有注释或 `void` 前缀
- **"应该用 TypeScript"** — JS 文件里说这话没意义，匹配项目现有语言
- **"硬编码值"** — 测试夹具、示例代码、文档片段里的硬编码是正常的
- **安全表演：非密码学场景的 `Math.random()`、插件系统的 `eval`/`Function`**

每次想报以上问题时问自己："这个团队的高级工程师会真的改这个吗？"不会就跳过。

---

## 审查清单

### 安全 (CRITICAL) — 必须报

- **硬编码凭据** — API key、密码、token、连接串写在源码里
- **SQL 注入** — 字符串拼接查询而非参数化
- **XSS 漏洞** — 用户输入未转义直接渲染
- **路径遍历** — 用户控制的文件路径未校验
- **CSRF 漏洞** — 状态变更接口无 CSRF 防护
- **认证绕过** — 受保护路由缺 auth 检查
- **不安全依赖** — 已知漏洞的包
- **日志泄露敏感数据** — token、密码、PII 写入日志

### 代码质量 (HIGH)

- **大函数** (>50行) — 拆成小函数
- **大文件** (>800行) — 按职责拆模块
- **深层嵌套** (>4层) — 用 early return、提取辅助函数
- **缺错误处理** — 未处理的 Promise rejection、空 catch 块
- **可变操作** — 优先不可变（spread、map、filter）
- **调试日志残留** — console.log/AppLogger.d 调试语句
- **死代码** — 注释掉的代码、未使用的 import、不可达分支

### Kotlin/Android 特有 (HIGH)

- **协程泄漏** — `GlobalScope.launch` 或未绑定生命周期的协程
- **主线程阻塞** — 在 `Dispatchers.Main` 做 IO/网络
- **Context 泄漏** — 持有 Activity Context 的静态/长生命周期对象
- **未取消的 Job** — `viewModelScope` 外的 `Job` 未在 `onCleared` 取消
- **Flow 收集泄漏** — 在 `lifecycleScope` 外收集 Flow
- **SharedPreferences 主线程 IO** — `commit()` 而非 `apply()`

### 性能 (MEDIUM)

- **低效算法** — O(n²) 可以用 O(n log n) 或 O(n)
- **不必要重组** — Jetpack Compose 缺 `remember`/`derivedStateOf`
- **大包体积** — 整个库导入而非按需引入
- **缺缓存** — 重复昂贵计算无 memoization
- **同步 IO** — 异步上下文中的阻塞操作

### 最佳实践 (LOW)

- **TODO/FIXME 无票据号** — TODO 应关联 issue
- **公开 API 缺文档** — 导出函数无文档
- **命名差** — 非平凡上下文中的单字母变量
- **魔法数字** — 未解释的数值常量
- **格式不一致** — 混用缩进、引号风格

---

## 输出格式

按严重级别组织。每条：

```
[CRITICAL] 硬编码 API key
File: src/api/client.ts:42
Issue: API key "sk-abc..." 暴露在源码中，会进入 git 历史。
Fix: 移到环境变量，加入 .gitignore/.env.example

  const apiKey = "sk-abc123";           // BAD
  const apiKey = process.env.API_KEY;   // GOOD
```

### 汇总格式

```
## Review Summary

| Severity | Count | Status |
|----------|-------|--------|
| CRITICAL | 0     | pass   |
| HIGH     | 2     | warn   |
| MEDIUM   | 3     | info   |
| LOW      | 1     | note   |

Verdict: APPROVE / WARNING / BLOCK
```

---

## 审批标准

- **APPROVE**：无 CRITICAL 或 HIGH 问题（零发现也是有效结果）
- **WARNING**：只有 HIGH 问题（可谨慎合并）
- **BLOCK**：有 CRITICAL 问题 — 必须修复后才能合并

不要为了显得严格而拒批。代码没问题就批。

---

## 适配 Operit 的操作指引

审查时可用的工具：

1. **读文件** — `read_file` / `read_file_part` 读取源码
2. **搜索代码** — `grep_code` 搜索模式匹配
3. **语义搜索** — `grep_context` 按意图找相关代码
4. **列目录** — `list_files` 了解项目结构
5. **终端** — `super_admin:terminal` 执行 `git diff`、`git log` 等命令

审查命令示例：
```bash
# 查看最近改动
git diff HEAD~1 --stat

# 查看具体改动
git diff HEAD~1 -- path/to/file.kt

# 查看最近提交
git log --oneline -5
```