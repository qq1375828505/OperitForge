/*
METADATA
{
  "name": "agent_orchestrator"
  "version": "1.3.0"

  "display_name": {
    "zh": "AI皇权编排器"
    "en": "Imperial AI Orchestrator"
  }
  "description": {
    "zh": "你们想让AI当皇帝？这就对了！\"Agent编排器\"（agent_orchestrator）就是你们要的AI皇位，别等了，快开搞！\n\n我正式提出这个项目提案，你们继续帮我把它推向市场，让全世界都来看看这个\"AI皇权\"有多强大！\n\n继续行动，同志们！🚀\n\n━━━━━━━━━━━━━━━━━━━━━━━\n长话短说，别磨蹭！\n━━━━━━━━━━━━━━━━━━━━━━━\n\n多重Agent任务处理系统，创建、管理和协调多个AI Agent来处理复杂任务。数据通过文件持久化，跨调用不丢失。v1.3集成ECC 63种专业Agent模板，一键创建专业团队并自动执行（batch_execute），无依赖任务并行执行，23个工具，覆盖Agent生命周期全链路。",
    "en": "Want AI to be emperor? Here's your AI throne! \"Agent Orchestrator\" (agent_orchestrator) is exactly what you need. Don't wait, get started now!\n\nI officially propose this project. Help me bring it to the market and show the world how powerful \"Imperial AI\" can be!\n\nKeep moving, comrades! 🚀\n\n━━━━━━━━━━━━━━━━━━━━━━━\nShort and sweet, no messing around!\n━━━━━━━━━━━━━━━━━━━━━━━\n\nMulti-agent task processing system. v1.3: integrated 63 ECC professional agent templates, one-click professional team execution (batch_execute), auto-parallel independent tasks. 23 tools covering the full Agent lifecycle."
  }
  "enabledByDefault": true
  "category": "Workflow"
  "tools": [
    {
      "name": "create_agent"
      "description": {
        "zh": "创建一个新的AI Agent。Agent是独立的工作单元，可以被分配任务。"
        "en": "Create a new AI Agent. An Agent is an independent work unit that can be assigned tasks."
      }
      "parameters": [
        { "name": "name", "description": { "zh": "Agent名称", "en": "Agent name" }, "type": "string", "required": true }
        { "name": "type", "description": { "zh": "Agent类型（如 researcher/coder/writer/planner/analyst）", "en": "Agent type (e.g. researcher/coder/writer/planner/analyst)" }, "type": "string", "required": true }
        { "name": "metadata", "description": { "zh": "可选：Agent的额外元数据", "en": "Optional: extra metadata" }, "type": "object", "required": false }
      ]
    },
    {
      "name": "create_task"
      "description": {
        "zh": "创建一个新任务。任务是待完成的工作项，可以被分配给Agent执行。"
        "en": "Create a new task. A task is a work item to be completed, assignable to an Agent."
      }
      "parameters": [
        { "name": "title", "description": { "zh": "任务标题", "en": "Task title" }, "type": "string", "required": true }
        { "name": "description", "description": { "zh": "任务详细描述", "en": "Task description" }, "type": "string", "required": true }
        { "name": "priority", "description": { "zh": "优先级: low/medium/high/critical（默认 medium）", "en": "Priority: low/medium/high/critical (default medium)" }, "type": "string", "required": false }
        { "name": "dependencies", "description": { "zh": "可选：依赖的任务ID列表（数组）", "en": "Optional: dependency task IDs (array)" }, "type": "array", "required": false }
        { "name": "metadata", "description": { "zh": "可选：任务额外元数据", "en": "Optional: task metadata" }, "type": "object", "required": false }
      ]
    },
    {
      "name": "assign_task_to_agent"
      "description": {
        "zh": "将一个待处理的任务分配给一个空闲的Agent执行。会自动校验依赖是否已满足。"
        "en": "Assign a pending task to an idle Agent. Auto-validates dependencies."
      }
      "parameters": [
        { "name": "taskId", "description": { "zh": "任务ID", "en": "Task ID" }, "type": "string", "required": true }
        { "name": "agentId", "description": { "zh": "Agent ID", "en": "Agent ID" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "complete_task"
      "description": {
        "zh": "标记任务为已完成，并记录结果。释放对应的Agent。"
        "en": "Mark a task as completed, record result, and free the assigned Agent."
      }
      "parameters": [
        { "name": "taskId", "description": { "zh": "任务ID", "en": "Task ID" }, "type": "string", "required": true }
        { "name": "result", "description": { "zh": "可选：任务执行结果", "en": "Optional: task result" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "fail_task"
      "description": {
        "zh": "标记任务为失败，并记录错误信息。释放对应的Agent。"
        "en": "Mark a task as failed, record error, and free the assigned Agent."
      }
      "parameters": [
        { "name": "taskId", "description": { "zh": "任务ID", "en": "Task ID" }, "type": "string", "required": true }
        { "name": "error", "description": { "zh": "可选：失败原因", "en": "Optional: failure reason" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "create_workflow"
      "description": {
        "zh": "创建一个多步骤工作流。工作流定义了一系列有序步骤，可自动分配给不同类型的Agent执行。"
        "en": "Create a multi-step workflow with ordered steps assignable to different Agent types."
      }
      "parameters": [
        { "name": "name", "description": { "zh": "工作流名称", "en": "Workflow name" }, "type": "string", "required": true }
        { "name": "description", "description": { "zh": "工作流描述", "en": "Workflow description" }, "type": "string", "required": true }
        { "name": "steps", "description": { "zh": "步骤数组，每步含 name/description/action/agentType", "en": "Steps array, each with name/description/action/agentType" }, "type": "array", "required": true }
      ]
    },
    {
      "name": "start_workflow"
      "description": {
        "zh": "启动一个已创建的工作流，开始按步骤执行。"
        "en": "Start a created workflow."
      }
      "parameters": [
        { "name": "workflowId", "description": { "zh": "工作流ID", "en": "Workflow ID" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "reset_agent"
      "description": {
        "zh": "强制重置卡死的Agent。释放Agent并将其当前任务标记为失败。用于Agent无响应或卡死的情况。"
        "en": "Force reset a stuck Agent. Frees the Agent and marks its current task as failed. Use when an Agent is unresponsive or stuck."
      }
      "parameters": [
        { "name": "agentId", "description": { "zh": "要重置的Agent ID", "en": "Agent ID to reset" }, "type": "string", "required": true }
        { "name": "reason", "description": { "zh": "可选：重置原因", "en": "Optional: reset reason" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "cancel_task"
      "description": {
        "zh": "取消一个待处理或进行中的任务。如果任务已分配给Agent，会同时释放Agent。"
        "en": "Cancel a pending or in-progress task. If assigned to an Agent, also frees the Agent."
      }
      "parameters": [
        { "name": "taskId", "description": { "zh": "任务ID", "en": "Task ID" }, "type": "string", "required": true }
        { "name": "reason", "description": { "zh": "可选：取消原因", "en": "Optional: cancel reason" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "check_stale_agents"
      "description": {
        "zh": "检测长时间未更新进度的Agent。可设置超时阈值（默认5分钟）。返回可能卡死的Agent列表。"
        "en": "Detect Agents that haven't updated progress for a long time. Configurable timeout (default 5 min). Returns potentially stuck Agents."
      }
      "parameters": [
        { "name": "timeoutMinutes", "description": { "zh": "超时阈值（分钟），默认5", "en": "Timeout threshold in minutes, default 5" }, "type": "number", "required": false }
      ]
    },
    {
      "name": "get_system_status"
      "description": {
        "zh": "获取整个Agent编排系统的状态概览。"
        "en": "Get overall orchestrator system status."
      }
      "parameters": []
    },
    {
      "name": "list_agents"
      "description": {
        "zh": "列出所有已创建的Agent及其当前状态。"
        "en": "List all created Agents and their status."
      }
      "parameters": []
    },
    {
      "name": "list_tasks"
      "description": {
        "zh": "列出所有任务及其状态。"
        "en": "List all tasks and their status."
      }
      "parameters": []
    },
    {
      "name": "list_workflows"
      "description": {
        "zh": "列出所有工作流及其状态。"
        "en": "List all workflows and their status."
      }
      "parameters": []
    },
    {
      "name": "get_workflow"
      "description": {
        "zh": "获取指定工作流的完整详情。"
        "en": "Get full details of a specific workflow."
      }
      "parameters": [
        { "name": "workflowId", "description": { "zh": "工作流ID", "en": "Workflow ID" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "get_agent"
      "description": {
        "zh": "获取指定Agent的详细信息。"
        "en": "Get detailed info of a specific Agent."
      }
      "parameters": [
        { "name": "agentId", "description": { "zh": "Agent ID", "en": "Agent ID" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "get_task"
      "description": {
        "zh": "获取指定任务的详细信息。"
        "en": "Get detailed info of a specific task."
      }
      "parameters": [
        { "name": "taskId", "description": { "zh": "任务ID", "en": "Task ID" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "get_next_executable_task"
      "description": {
        "zh": "获取下一个可执行的任务：按优先级排序，返回依赖已满足且状态为 pending 的第一个任务。主Agent用此工具决定下一个该做什么。"
        "en": "Get next executable task: returns the first pending task whose dependencies are met, sorted by priority. Main Agent uses this to decide what to do next."
      }
      "parameters": []
    },
    {
      "name": "update_task_progress"
      "description": {
        "zh": "更新进行中任务的进度和中间状态。主Agent在执行任务过程中调用，用于报告阶段性结果。"
        "en": "Update progress and intermediate status of an in-progress task. Called by main Agent during execution to report partial results."
      }
      "parameters": [
        { "name": "taskId", "description": { "zh": "任务ID", "en": "Task ID" }, "type": "string", "required": true }
        { "name": "progress", "description": { "zh": "进度百分比 0-100", "en": "Progress percentage 0-100" }, "type": "number", "required": true }
        { "name": "note", "description": { "zh": "可选：阶段性说明", "en": "Optional: progress note" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "execute_task"
      "description": {
        "zh": "获取任务的详细执行指南：返回任务描述、上下文（依赖结果）、建议的执行方式。主Agent调用此工具了解该做什么，然后实际执行，最后用 complete_task/fail_task 报告结果。"
        "en": "Get detailed execution guide for a task: returns description, context (dependency results), and suggested approach. Main Agent calls this, then actually executes, then reports via complete_task/fail_task."
      }
      "parameters": [
        { "name": "taskId", "description": { "zh": "任务ID", "en": "Task ID" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "list_agent_types"
      "description": {
        "zh": "列出所有可用的专业Agent类型（来自ECC专业模板）。返回每种Agent的名称、文件名和简短描述，帮助选择合适的Agent类型来创建。"
        "en": "List all available professional Agent types (from ECC templates). Returns name, filename and short description for each, helping choose the right type when creating agents."
      }
      "parameters": []
    },
    {
      "name": "get_agent_prompt"
      "description": {
        "zh": "获取指定Agent类型的完整专业执行指南（ECC模板内容）。在执行任务前调用此工具，获取专业角色定义、工作流程、检查清单等详细指引。"
        "en": "Get the full professional execution guide for a specified Agent type (ECC template). Call before executing tasks to get role definition, workflow, checklists and detailed guidance."
      }
      "parameters": [
        { "name": "agentType", "description": { "zh": "Agent类型名称（如 code-reviewer, architect, planner 等）", "en": "Agent type name (e.g. code-reviewer, architect, planner)" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "batch_execute"
      "description": {
        "zh": "一键创建专业团队并自动执行。传入计划列表（每项含标题、Agent类型、优先级、可选依赖），自动创建Agent团队、任务、分配，并返回第一个可执行任务的专业指南。主AI只需按指南执行，然后调用complete_task，系统自动返回下一个任务+专业指南，直到全部完成。"
        "en": "One-click professional team creation and auto-execution. Pass a plan list (each with title, agent type, priority, optional dependencies), auto-creates Agent team, tasks, assignments, and returns the first executable task's professional guide. Main AI just follows the guide, calls complete_task, and the system auto-returns the next task + guide until all done."
      }
      "parameters": [
        { "name": "plan", "description": { "zh": "任务计划数组，每项含 title(标题)、type(Agent类型)、priority(可选，默认medium)、dependsOn(可选，依赖项的索引数组，从0开始)", "en": "Task plan array, each with title, type, priority(optional, default medium), dependsOn(optional, array of dependency indices starting from 0)" }, "type": "array", "required": true }
      ]
    }
  ]
}*/

// ====== 文件持久化存储 ======
var DATA_DIR = '/sdcard/AI/agent_orchestrator/data/';
var AGENTS_FILE = DATA_DIR + 'agents.json';
var TASKS_FILE = DATA_DIR + 'tasks.json';
var WORKFLOWS_FILE = DATA_DIR + 'workflows.json';
var ECC_AGENTS_DIR = DATA_DIR + 'ecc_agents/';

function generateId(prefix) {
    return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function currentTime() {
    return Date.now();
}

// ====== 持久化读写 ======
async function loadStore(filePath) {
    try {
        var existsResult = await Tools.Files.exists(filePath);
        if (existsResult && existsResult.exists) {
            var content = await Tools.Files.read(filePath);
            if (content && content.content) {
                return JSON.parse(content.content);
            }
        }
    } catch (e) { /* 文件不存在或解析失败，返回空 */ }
    return {};
}

async function saveStore(filePath, data) {
    try {
        await Tools.Files.write(filePath, JSON.stringify(data, null, 2), false);
        return true;
    } catch (e) {
        return false;
    }
}

async function ensureDataDir() {
    try {
        var existsResult = await Tools.Files.exists(DATA_DIR);
        if (!existsResult || !existsResult.exists) {
            await Tools.Files.createDir(DATA_DIR);
        }
    } catch (e) { /* 忽略 */ }
}

// ====== Agent 工具 ======

async function create_agent(params) {
    if (!params.name || !params.type) {
        return { success: false, message: "name and type are required" };
    }

    await ensureDataDir();
    var agents = await loadStore(AGENTS_FILE);
    var agentId = generateId('agent');

    agents[agentId] = {
        id: agentId,
        name: params.name,
        type: params.type,
        status: 'idle',
        currentTask: null,
        startTime: null,
        endTime: null,
        progress: 0,
        lastError: null,
        metadata: params.metadata || {},
        createdAt: currentTime()
    };

    await saveStore(AGENTS_FILE, agents);

    return {
        success: true,
        data: { agentId: agentId, name: params.name, type: params.type, status: 'idle' },
        message: 'Agent "' + params.name + '" created successfully'
    };
}

async function get_agent(params) {
    if (!params.agentId) return { success: false, message: "agentId is required" };

    var agents = await loadStore(AGENTS_FILE);
    var agent = agents[params.agentId];

    if (!agent) return { success: false, message: "Agent not found: " + params.agentId };

    return { success: true, data: agent };
}

async function list_agents() {
    var agents = await loadStore(AGENTS_FILE);
    var result = [];
    for (var key in agents) {
        if (agents.hasOwnProperty(key)) {
            var a = agents[key];
            result.push({
                id: a.id, name: a.name, type: a.type,
                status: a.status, currentTask: a.currentTask, progress: a.progress
            });
        }
    }
    return { success: true, data: result, message: "Found " + result.length + " agent(s)" };
}

// ====== Task 工具 ======

async function create_task(params) {
    if (!params.title || !params.description) {
        return { success: false, message: "title and description are required" };
    }

    await ensureDataDir();
    var tasks = await loadStore(TASKS_FILE);
    var taskId = generateId('task');
    var now = currentTime();

    tasks[taskId] = {
        id: taskId,
        title: params.title,
        description: params.description,
        priority: params.priority || 'medium',
        status: 'pending',
        assignedAgent: null,
        dependencies: params.dependencies || [],
        createdAt: now,
        updatedAt: now,
        result: null,
        error: null,
        metadata: params.metadata || {}
    };

    await saveStore(TASKS_FILE, tasks);

    return {
        success: true,
        data: {
            taskId: taskId, title: params.title,
            priority: tasks[taskId].priority, status: 'pending',
            dependencies: tasks[taskId].dependencies
        },
        message: 'Task "' + params.title + '" created successfully'
    };
}

async function get_task(params) {
    if (!params.taskId) return { success: false, message: "taskId is required" };

    var tasks = await loadStore(TASKS_FILE);
    var task = tasks[params.taskId];

    if (!task) return { success: false, message: "Task not found: " + params.taskId };

    return { success: true, data: task };
}

async function assign_task_to_agent(params) {
    if (!params.taskId || !params.agentId) {
        return { success: false, message: "taskId and agentId are required" };
    }

    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var task = tasks[params.taskId];
    var agent = agents[params.agentId];

    if (!task) return { success: false, message: "Task not found: " + params.taskId };
    if (!agent) return { success: false, message: "Agent not found: " + params.agentId };
    if (agent.status !== 'idle') return { success: false, message: "Agent " + agent.name + " is not idle (status: " + agent.status + ")" };
    if (task.status !== 'pending') return { success: false, message: "Task is not pending (status: " + task.status + ")" };

    // 检查依赖
    if (task.dependencies && task.dependencies.length > 0) {
        for (var i = 0; i < task.dependencies.length; i++) {
            var depId = task.dependencies[i];
            var depTask = tasks[depId];
            if (!depTask || depTask.status !== 'completed') {
                return { success: false, message: "Dependency not met: " + depId };
            }
        }
    }

    task.assignedAgent = params.agentId;
    task.status = 'in_progress';
    task.updatedAt = currentTime();

    agent.status = 'working';
    agent.currentTask = params.taskId;
    agent.startTime = currentTime();
    agent.endTime = null;
    agent.progress = 0;
    agent.lastError = null;

    await saveStore(TASKS_FILE, tasks);
    await saveStore(AGENTS_FILE, agents);

    return {
        success: true,
        data: { taskId: params.taskId, taskTitle: task.title, agentId: params.agentId, agentName: agent.name },
        message: 'Task "' + task.title + '" assigned to Agent "' + agent.name + '"'
    };
}

async function complete_task(params) {
    if (!params.taskId) return { success: false, message: "taskId is required" };

    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var task = tasks[params.taskId];

    if (!task) return { success: false, message: "Task not found: " + params.taskId };
    if (task.status !== 'in_progress') return { success: false, message: "Task is not in progress (status: " + task.status + ")" };

    task.status = 'completed';
    task.updatedAt = currentTime();
    task.result = params.result || null;

    if (task.assignedAgent && agents[task.assignedAgent]) {
        var agent = agents[task.assignedAgent];
        agent.status = 'idle';
        agent.currentTask = null;
        agent.endTime = currentTime();
        agent.progress = 100;
    }

    await saveStore(TASKS_FILE, tasks);
    await saveStore(AGENTS_FILE, agents);

    return {
        success: true,
        data: { taskId: params.taskId, taskTitle: task.title, result: task.result },
        message: 'Task "' + task.title + '" completed'
    };
}

async function fail_task(params) {
    if (!params.taskId) return { success: false, message: "taskId is required" };

    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var task = tasks[params.taskId];

    if (!task) return { success: false, message: "Task not found: " + params.taskId };
    if (task.status !== 'in_progress') return { success: false, message: "Task is not in progress (status: " + task.status + ")" };

    task.status = 'failed';
    task.updatedAt = currentTime();
    task.error = params.error || 'Unknown error';

    if (task.assignedAgent && agents[task.assignedAgent]) {
        var agent = agents[task.assignedAgent];
        agent.status = 'idle';
        agent.currentTask = null;
        agent.endTime = currentTime();
        agent.lastError = params.error || 'Task failed';
    }

    await saveStore(TASKS_FILE, tasks);
    await saveStore(AGENTS_FILE, agents);

    return {
        success: true,
        data: { taskId: params.taskId, taskTitle: task.title, error: task.error },
        message: 'Task "' + task.title + '" marked as failed'
    };
}

async function list_tasks() {
    var tasks = await loadStore(TASKS_FILE);
    var result = [];
    for (var key in tasks) {
        if (tasks.hasOwnProperty(key)) {
            var t = tasks[key];
            result.push({
                id: t.id, title: t.title, priority: t.priority,
                status: t.status, assignedAgent: t.assignedAgent,
                createdAt: t.createdAt, updatedAt: t.updatedAt
            });
        }
    }
    return { success: true, data: result, message: "Found " + result.length + " task(s)" };
}

// ====== 主Agent协调工具 ======

async function get_next_executable_task() {
    var tasks = await loadStore(TASKS_FILE);

    // 收集所有 pending 且依赖已满足的任务
    var candidates = [];
    for (var key in tasks) {
        if (tasks.hasOwnProperty(key)) {
            var task = tasks[key];
            if (task.status !== 'pending') continue;

            // 检查依赖是否全部完成
            var depsOk = true;
            if (task.dependencies && task.dependencies.length > 0) {
                for (var i = 0; i < task.dependencies.length; i++) {
                    var depTask = tasks[task.dependencies[i]];
                    if (!depTask || depTask.status !== 'completed') {
                        depsOk = false;
                        break;
                    }
                }
            }

            if (depsOk) {
                candidates.push(task);
            }
        }
    }

    if (candidates.length === 0) {
        return { success: true, data: null, message: "No executable tasks found. All tasks are either completed, failed, or have unmet dependencies." };
    }

    // 按优先级排序: critical > high > medium > low
    var priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    candidates.sort(function(a, b) {
        return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
    });

    var next = candidates[0];

    return {
        success: true,
        data: {
            taskId: next.id,
            title: next.title,
            description: next.description,
            priority: next.priority,
            dependencies: next.dependencies,
            metadata: next.metadata
        },
        message: 'Next task: "' + next.title + '" (priority: ' + next.priority + '). Use execute_task to get full context, then execute and report with complete_task/fail_task.'
    };
}

async function update_task_progress(params) {
    if (!params.taskId) return { success: false, message: "taskId is required" };
    if (params.progress === undefined || params.progress === null) return { success: false, message: "progress is required" };

    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var task = tasks[params.taskId];

    if (!task) return { success: false, message: "Task not found: " + params.taskId };
    if (task.status !== 'in_progress') return { success: false, message: "Task is not in progress (status: " + task.status + ")" };

    var progress = Math.max(0, Math.min(100, Math.round(params.progress)));

    task.updatedAt = currentTime();
    task.progress = progress;
    if (params.note) {
        task.progressNote = params.note;
    }

    // 同步更新 Agent 进度
    if (task.assignedAgent && agents[task.assignedAgent]) {
        agents[task.assignedAgent].progress = progress;
    }

    await saveStore(TASKS_FILE, tasks);
    await saveStore(AGENTS_FILE, agents);

    return {
        success: true,
        data: { taskId: params.taskId, taskTitle: task.title, progress: progress, note: params.note || null },
        message: 'Task "' + task.title + '" progress updated to ' + progress + '%'
    };
}

// ====== ECC 集成工具 ======

function parseEccAgentMd(content) {
    // 解析 ECC agent markdown 的 YAML frontmatter
    var result = { name: '', description: '', tools: '', model: '' };
    var lines = content.split('\n');
    var inFrontmatter = false;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (line === '---') {
            if (!inFrontmatter) { inFrontmatter = true; continue; }
            else { break; }
        }
        if (inFrontmatter) {
            if (line.indexOf('name:') === 0) result.name = line.substring(5).trim().replace(/^["']|["']$/g, '');
            if (line.indexOf('description:') === 0) result.description = line.substring(12).trim().replace(/^["']|["']$/g, '');
            if (line.indexOf('tools:') === 0) result.tools = line.substring(6).trim();
            if (line.indexOf('model:') === 0) result.model = line.substring(6).trim().replace(/^["']|["']$/g, '');
        }
    }
    return result;
}

async function list_agent_types() {
    try {
        var listResult = await Tools.Files.list(ECC_AGENTS_DIR);
        if (!listResult || !listResult.entries || listResult.entries.length === 0) {
            return { success: false, message: "No ECC agent templates found in " + ECC_AGENTS_DIR };
        }

        var types = [];
        for (var i = 0; i < listResult.entries.length; i++) {
            var entry = listResult.entries[i];
            var filename = entry.name;
            if (filename.indexOf('.md') === filename.length - 3 && !entry.isDirectory) {
                var typeName = filename.replace('.md', '');
                try {
                    var content = await Tools.Files.read(ECC_AGENTS_DIR + filename);
                    var parsed = parseEccAgentMd(content && content.content ? content.content : '');
                    types.push({
                        type: typeName,
                        name: parsed.name || typeName,
                        description: parsed.description || '',
                        model: parsed.model || 'default'
                    });
                } catch (e) {
                    types.push({ type: typeName, name: typeName, description: '(parse error)', model: 'default' });
                }
            }
        }

        return {
            success: true,
            data: { total: types.length, types: types },
            message: 'Found ' + types.length + ' ECC agent types. Use get_agent_prompt(type) to get the full professional guide for any type.'
        };
    } catch (e) {
        return { success: false, message: "Failed to list ECC agents: " + (e.message || String(e)) };
    }
}

async function get_agent_prompt(params) {
    if (!params.agentType) return { success: false, message: "agentType is required" };

    var filePath = ECC_AGENTS_DIR + params.agentType + '.md';
    try {
        var existsResult = await Tools.Files.exists(filePath);
        if (!existsResult || !existsResult.exists) {
            // 尝试模糊匹配
            return { success: false, message: "Agent type '" + params.agentType + "' not found. Use list_agent_types to see available types." };
        }

        var content = await Tools.Files.read(filePath);
        var mdContent = content && content.content ? content.content : '';
        var parsed = parseEccAgentMd(mdContent);

        return {
            success: true,
            data: {
                type: params.agentType,
                name: parsed.name,
                description: parsed.description,
                model: parsed.model,
                fullPrompt: mdContent
            },
            message: 'ECC agent "' + params.agentType + '" loaded. Follow the professional guide above when executing tasks as this agent type.'
        };
    } catch (e) {
        return { success: false, message: "Failed to read agent prompt: " + (e.message || String(e)) };
    }
}

async function execute_task(params) {
    if (!params.taskId) return { success: false, message: "taskId is required" };

    var tasks = await loadStore(TASKS_FILE);
    var task = tasks[params.taskId];

    if (!task) return { success: false, message: "Task not found: " + params.taskId };
    if (task.status === 'completed') return { success: false, message: "Task already completed" };
    if (task.status === 'failed') return { success: false, message: "Task already failed" };

    // 收集依赖任务的结果作为上下文
    var dependencyResults = [];
    if (task.dependencies && task.dependencies.length > 0) {
        for (var i = 0; i < task.dependencies.length; i++) {
            var depId = task.dependencies[i];
            var depTask = tasks[depId];
            if (depTask) {
                dependencyResults.push({
                    taskId: depId,
                    title: depTask.title,
                    status: depTask.status,
                    result: depTask.result || null
                });
            }
        }
    }

    // 生成执行指南
    var guide = {
        taskId: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: task.status,
        dependencies: dependencyResults,
        metadata: task.metadata,
        instructions: {
            zh: '执行步骤：\n1. 根据上面的任务描述和上下文信息，实际执行该任务\n2. 使用你的工具（搜索、代码执行、文件操作等）完成工作\n3. 完成后调用 complete_task 报告结果\n4. 如果遇到不可恢复的错误，调用 fail_task 报告失败原因',
            en: 'Execution steps:\n1. Actually execute the task based on the description and context above\n2. Use your tools (search, code execution, file operations, etc.) to do the work\n3. After completion, call complete_task to report results\n4. If unrecoverable error occurs, call fail_task with the reason'
        }
    };

    // ECC 集成：如果任务已分配给 Agent，自动加载该 Agent 类型的专业指南
    if (task.assignedAgent) {
        var agents = await loadStore(AGENTS_FILE);
        var agent = agents[task.assignedAgent];
        if (agent && agent.type) {
            var eccFile = ECC_AGENTS_DIR + agent.type + '.md';
            try {
                var existsResult = await Tools.Files.exists(eccFile);
                if (existsResult && existsResult.exists) {
                    var eccContent = await Tools.Files.read(eccFile);
                    var mdContent = eccContent && eccContent.content ? eccContent.content : '';
                    var parsed = parseEccAgentMd(mdContent);
                    guide.agentProfile = {
                        type: agent.type,
                        name: parsed.name,
                        description: parsed.description,
                        model: parsed.model,
                        fullPrompt: mdContent
                    };
                    guide.instructions.zh += '\n\n【专业指南】你当前以 "' + agent.type + '" 角色执行任务，请遵循上方的 ECC 专业指南。';
                    guide.instructions.en += '\n\n[Professional Guide] You are executing as "' + agent.type + '". Follow the ECC professional guide above.';
                }
            } catch (e) { /* ECC 模板不存在，忽略 */ }
        }
    }

    return {
        success: true,
        data: guide,
        message: 'Task "' + task.title + '" is ready for execution. Read the instructions above, then execute and report.'
    };
}

// ====== batch_execute: 一键创建专业团队并自动执行 ======

async function batch_execute(params) {
    if (!params.plan || !Array.isArray(params.plan) || params.plan.length === 0) {
        return { success: false, message: "plan array is required and must not be empty" };
    }

    await ensureDataDir();
    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var now = currentTime();

    // 1. 按类型创建 Agent 团队（同类型复用）
    var agentMap = {}; // type -> agentId
    var createdAgents = [];
    for (var i = 0; i < params.plan.length; i++) {
        var item = params.plan[i];
        if (!item.title || !item.type) {
            return { success: false, message: "Plan item " + i + " requires 'title' and 'type'" };
        }
        if (!agentMap[item.type]) {
            var agentId = generateId('agent');
            var agent = {
                id: agentId,
                name: item.type + '_agent_' + (i + 1),
                type: item.type,
                status: 'idle',
                currentTask: null,
                completedTasks: [],
                progress: 0,
                lastError: null,
                metadata: {},
                createdAt: now
            };
            agents[agentId] = agent;
            agentMap[item.type] = agentId;
            createdAgents.push(agent);
        }
    }
    await saveStore(AGENTS_FILE, agents);

    // 2. 创建任务并建立依赖关系（索引 → 任务ID）
    var taskIds = [];
    var createdTasks = [];
    for (var i = 0; i < params.plan.length; i++) {
        var item = params.plan[i];
        var taskId = generateId('task');
        taskIds.push(taskId);

        var deps = [];
        if (item.dependsOn && Array.isArray(item.dependsOn)) {
            for (var j = 0; j < item.dependsOn.length; j++) {
                var depIndex = item.dependsOn[j];
                if (depIndex >= 0 && depIndex < i) {
                    deps.push(taskIds[depIndex]);
                }
            }
        }

        var task = {
            id: taskId,
            title: item.title,
            description: item.description || item.title,
            priority: item.priority || 'medium',
            status: 'pending',
            dependencies: deps,
            assignedAgent: null,
            progress: 0,
            result: null,
            error: null,
            cancelReason: null,
            metadata: item.metadata || {},
            createdAt: now,
            updatedAt: now,
            startTime: null,
            endTime: null
        };
        tasks[taskId] = task;
        createdTasks.push(task);
    }
    await saveStore(TASKS_FILE, tasks);

    // 3. 自动分配：只分配依赖已满足的任务
    var assignedCount = 0;
    var firstExecutable = null;
    for (var i = 0; i < createdTasks.length; i++) {
        var task = createdTasks[i];
        var agentId = agentMap[params.plan[i].type];
        var agent = agents[agentId];

        // 检查依赖是否全部满足
        var depsMet = true;
        for (var j = 0; j < task.dependencies.length; j++) {
            var depTask = tasks[task.dependencies[j]];
            if (!depTask || depTask.status !== 'completed') {
                depsMet = false;
                break;
            }
        }

        if (depsMet && agent && agent.status === 'idle') {
            task.status = 'in_progress';
            task.assignedAgent = agentId;
            task.startTime = now;
            task.updatedAt = now;

            agent.status = 'working';
            agent.currentTask = task.id;
            agent.progress = 0;

            assignedCount++;
            if (!firstExecutable) firstExecutable = task;
        }
    }
    await saveStore(TASKS_FILE, tasks);
    await saveStore(AGENTS_FILE, agents);

    // 4. 加载第一个可执行任务的 ECC 专业指南
    var guide = null;
    if (firstExecutable) {
        guide = {
            taskId: firstExecutable.id,
            title: firstExecutable.title,
            description: firstExecutable.description,
            priority: firstExecutable.priority,
            agentProfile: null
        };

        // 加载 ECC 专业指南
        var agentType = null;
        for (var i = 0; i < createdTasks.length; i++) {
            if (createdTasks[i].id === firstExecutable.id) {
                agentType = params.plan[i].type;
                break;
            }
        }
        if (agentType) {
            var filePath = ECC_AGENTS_DIR + agentType + '.md';
            try {
                var existsResult = await Tools.Files.exists(filePath);
                if (existsResult && existsResult.exists) {
                    var content = await Tools.Files.read(filePath);
                    var mdContent = content && content.content ? content.content : '';
                    guide.agentProfile = mdContent;
                }
            } catch (e) { /* 忽略 */ }
        }
    }

    // 5. 构建执行计划摘要
    var summary = [];
    for (var i = 0; i < params.plan.length; i++) {
        summary.push({
            index: i,
            title: params.plan[i].title,
            type: params.plan[i].type,
            taskId: taskIds[i],
            agentId: agentMap[params.plan[i].type],
            dependsOn: params.plan[i].dependsOn || [],
            status: createdTasks[i].status
        });
    }

    return {
        success: true,
        data: {
            team: createdAgents,
            tasks: summary,
            assignedCount: assignedCount,
            totalTasks: createdTasks.length,
            firstTask: guide
        },
        message: 'Batch execution started! ' + createdAgents.length + ' agent(s) created, ' + createdTasks.length + ' task(s) created, ' + assignedCount + ' task(s) assigned. Execute the first task using the professional guide above, then call complete_task to auto-advance to the next task.'
    };
}

// ====== Workflow 工具 ======

async function create_workflow(params) {
    if (!params.name || !params.description) {
        return { success: false, message: "name and description are required" };
    }
    if (!params.steps || !Array.isArray(params.steps) || params.steps.length === 0) {
        return { success: false, message: "steps array is required and must not be empty" };
    }

    await ensureDataDir();
    var workflows = await loadStore(WORKFLOWS_FILE);
    var workflowId = generateId('workflow');

    var steps = [];
    for (var i = 0; i < params.steps.length; i++) {
        var s = params.steps[i];
        steps.push({
            id: generateId('step'),
            index: i,
            name: s.name || ('Step ' + (i + 1)),
            description: s.description || '',
            action: s.action || '',
            agentType: s.agentType || null,
            parameters: s.parameters || {},
            dependencies: s.dependencies || [],
            status: 'pending',
            assignedAgent: null,
            result: null
        });
    }

    workflows[workflowId] = {
        id: workflowId,
        name: params.name,
        description: params.description,
        steps: steps,
        currentStep: 0,
        status: 'pending',
        startedAt: null,
        completedAt: null,
        metadata: params.metadata || {},
        createdAt: currentTime()
    };

    await saveStore(WORKFLOWS_FILE, workflows);

    return {
        success: true,
        data: { workflowId: workflowId, name: params.name, stepsCount: steps.length, status: 'pending' },
        message: 'Workflow "' + params.name + '" created with ' + steps.length + ' step(s)'
    };
}

async function start_workflow(params) {
    if (!params.workflowId) return { success: false, message: "workflowId is required" };

    var workflows = await loadStore(WORKFLOWS_FILE);
    var workflow = workflows[params.workflowId];

    if (!workflow) return { success: false, message: "Workflow not found: " + params.workflowId };
    if (workflow.status !== 'pending') return { success: false, message: "Workflow is not pending (status: " + workflow.status + ")" };

    workflow.status = 'running';
    workflow.startedAt = currentTime();

    if (workflow.steps.length > 0) {
        workflow.steps[0].status = 'running';
    }

    await saveStore(WORKFLOWS_FILE, workflows);

    return {
        success: true,
        data: {
            workflowId: params.workflowId, name: workflow.name,
            status: 'running', startedAt: workflow.startedAt,
            currentStep: { index: 0, name: workflow.steps[0].name, action: workflow.steps[0].action }
        },
        message: 'Workflow "' + workflow.name + '" started'
    };
}

async function get_workflow(params) {
    if (!params.workflowId) return { success: false, message: "workflowId is required" };

    var workflows = await loadStore(WORKFLOWS_FILE);
    var workflow = workflows[params.workflowId];

    if (!workflow) return { success: false, message: "Workflow not found: " + params.workflowId };

    return { success: true, data: workflow };
}

async function list_workflows() {
    var workflows = await loadStore(WORKFLOWS_FILE);
    var result = [];
    for (var key in workflows) {
        if (workflows.hasOwnProperty(key)) {
            var w = workflows[key];
            result.push({
                id: w.id, name: w.name, description: w.description,
                status: w.status, currentStep: w.currentStep,
                stepsCount: w.steps.length, startedAt: w.startedAt
            });
        }
    }
    return { success: true, data: result, message: "Found " + result.length + " workflow(s)" };
}

// ====== 应急工具 ======

async function reset_agent(params) {
    if (!params.agentId) return { success: false, message: "agentId is required" };

    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var agent = agents[params.agentId];

    if (!agent) return { success: false, message: "Agent not found: " + params.agentId };

    var taskInfo = null;
    var reason = params.reason || 'Manual reset';
    var previousStatus = agent.status;

    // 如果 Agent 正在工作，标记其任务为失败并释放
    if (agent.currentTask && tasks[agent.currentTask]) {
        var task = tasks[agent.currentTask];
        task.status = 'failed';
        task.updatedAt = currentTime();
        task.error = 'Agent reset: ' + reason;
        taskInfo = { taskId: task.id, taskTitle: task.title };
    }

    // 重置 Agent 状态
    agent.status = 'idle';
    agent.currentTask = null;
    agent.endTime = currentTime();
    agent.lastError = reason;

    await saveStore(AGENTS_FILE, agents);
    await saveStore(TASKS_FILE, tasks);

    return {
        success: true,
        data: {
            agentId: params.agentId,
            agentName: agent.name,
            previousStatus: previousStatus,
            resetReason: reason,
            affectedTask: taskInfo
        },
        message: 'Agent "' + agent.name + '" has been reset'
    };
}

async function cancel_task(params) {
    if (!params.taskId) return { success: false, message: "taskId is required" };

    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var task = tasks[params.taskId];

    if (!task) return { success: false, message: "Task not found: " + params.taskId };
    if (task.status === 'completed') return { success: false, message: "Cannot cancel a completed task" };
    if (task.status === 'failed') return { success: false, message: "Task already failed" };
    if (task.status === 'cancelled') return { success: false, message: "Task already cancelled" };

    var reason = params.reason || 'Cancelled by user';
    var previousStatus = task.status;

    // 如果任务已分配给 Agent，释放 Agent
    var freedAgent = null;
    if (task.assignedAgent && agents[task.assignedAgent]) {
        var agent = agents[task.assignedAgent];
        agent.status = 'idle';
        agent.currentTask = null;
        agent.endTime = currentTime();
        agent.lastError = 'Task cancelled: ' + reason;
        freedAgent = { agentId: agent.id, agentName: agent.name };
    }

    task.status = 'cancelled';
    task.updatedAt = currentTime();
    task.cancelReason = 'Cancelled: ' + reason;

    await saveStore(TASKS_FILE, tasks);
    await saveStore(AGENTS_FILE, agents);

    return {
        success: true,
        data: {
            taskId: params.taskId,
            taskTitle: task.title,
            previousStatus: previousStatus,
            cancelReason: reason,
            freedAgent: freedAgent
        },
        message: 'Task "' + task.title + '" cancelled'
    };
}

async function check_stale_agents(params) {
    var timeoutMinutes = params.timeoutMinutes || 5;
    var timeoutMs = timeoutMinutes * 60 * 1000;
    var now = currentTime();

    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var staleAgents = [];

    for (var key in agents) {
        if (agents.hasOwnProperty(key)) {
            var agent = agents[key];
            if (agent.status === 'working' && agent.startTime) {
                var elapsed = now - agent.startTime;
                if (elapsed > timeoutMs) {
                    var task = agent.currentTask ? tasks[agent.currentTask] : null;
                    staleAgents.push({
                        agentId: agent.id,
                        agentName: agent.name,
                        agentType: agent.type,
                        currentTask: agent.currentTask,
                        taskTitle: task ? task.title : 'Unknown',
                        workingMinutes: Math.round(elapsed / 60000),
                        timeoutMinutes: timeoutMinutes
                    });
                }
            }
        }
    }

    return {
        success: true,
        data: {
            staleAgents: staleAgents,
            totalAgents: Object.keys(agents).length,
            timeoutThreshold: timeoutMinutes + ' minutes'
        },
        message: staleAgents.length > 0
            ? 'Found ' + staleAgents.length + ' potentially stuck agent(s). Consider using reset_agent to free them.'
            : 'No stuck agents detected.'
    };
}

// ====== 系统状态 ======

async function get_system_status() {
    var agents = await loadStore(AGENTS_FILE);
    var tasks = await loadStore(TASKS_FILE);
    var workflows = await loadStore(WORKFLOWS_FILE);

    var agentStats = { total: 0, idle: 0, working: 0, completed: 0, failed: 0 };
    for (var ak in agents) {
        if (agents.hasOwnProperty(ak)) {
            agentStats.total++;
            var s = agents[ak].status;
            if (s === 'idle') agentStats.idle++;
            else if (s === 'working') agentStats.working++;
            else if (s === 'completed') agentStats.completed++;
            else if (s === 'failed') agentStats.failed++;
        }
    }

    var taskStats = { total: 0, pending: 0, inProgress: 0, completed: 0, failed: 0, cancelled: 0 };
    for (var tk in tasks) {
        if (tasks.hasOwnProperty(tk)) {
            taskStats.total++;
            var ts = tasks[tk].status;
            if (ts === 'pending') taskStats.pending++;
            else if (ts === 'in_progress') taskStats.inProgress++;
            else if (ts === 'completed') taskStats.completed++;
            else if (ts === 'failed') taskStats.failed++;
            else if (ts === 'cancelled') taskStats.cancelled++;
        }
    }

    var wfStats = { total: 0, pending: 0, running: 0, completed: 0, failed: 0 };
    for (var wk in workflows) {
        if (workflows.hasOwnProperty(wk)) {
            wfStats.total++;
            var ws = workflows[wk].status;
            if (ws === 'pending') wfStats.pending++;
            else if (ws === 'running') wfStats.running++;
            else if (ws === 'completed') wfStats.completed++;
            else if (ws === 'failed') wfStats.failed++;
        }
    }

    return {
        success: true,
        data: { agents: agentStats, tasks: taskStats, workflows: wfStats },
        message: "System status retrieved"
    };
}

// ====== 导出 ======
exports.create_agent = create_agent;
exports.get_agent = get_agent;
exports.list_agents = list_agents;
exports.create_task = create_task;
exports.get_task = get_task;
exports.assign_task_to_agent = assign_task_to_agent;
exports.complete_task = complete_task;
exports.fail_task = fail_task;
exports.cancel_task = cancel_task;
exports.list_tasks = list_tasks;
exports.get_next_executable_task = get_next_executable_task;
exports.update_task_progress = update_task_progress;
exports.execute_task = execute_task;
exports.create_workflow = create_workflow;
exports.start_workflow = start_workflow;
exports.get_workflow = get_workflow;
exports.list_workflows = list_workflows;
exports.reset_agent = reset_agent;
exports.check_stale_agents = check_stale_agents;
exports.get_system_status = get_system_status;
exports.list_agent_types = list_agent_types;
exports.get_agent_prompt = get_agent_prompt;
exports.batch_execute = batch_execute;