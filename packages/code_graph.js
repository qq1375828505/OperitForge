/*
METADATA
{
  "name": "mimo_code"
  "version": "1.0.0"
  "display_name": { "zh": "MiMo代码工具", "en": "MiMo Code Tools" }
  "description": {
    "zh": "从 MiMo Code 移植的代码操作工具集。包含搜索、读取、探索、结构分析、依赖查找、文件查找、代码编辑、文件写入共8个工具，覆盖代码开发全链路。",
    "en": "Code tools ported from MiMo Code. 8 tools: search, read, explore, structure, related, glob, edit, write."
  }
  "enabledByDefault": true
  "category": "Development"
  "tools": [
    {
      "name": "mimo_search"
      "description": { "zh": "代码搜索：正则匹配 + 上下文行显示", "en": "Code search with regex and context" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "pattern", "description": { "zh": "正则模式", "en": "Regex pattern" }, "type": "string", "required": true }
        { "name": "include", "description": { "zh": "文件过滤如 *.kt,*.java", "en": "File filter e.g. *.kt" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "mimo_read"
      "description": { "zh": "代码读取：带行号、符号标注、分页", "en": "Smart read with line numbers and symbol labels" }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
        { "name": "offset", "description": { "zh": "起始行（从1开始）", "en": "Start line" }, "type": "number", "required": false }
        { "name": "limit", "description": { "zh": "行数（默认200）", "en": "Line count (default 200)" }, "type": "number", "required": false }
      ]
    },
    {
      "name": "mimo_explore"
      "description": { "zh": "符号探索：找到定义+所有引用，一次返回完整画像", "en": "Explore symbol: definition + all references" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "symbol", "description": { "zh": "符号名", "en": "Symbol name" }, "type": "string", "required": true }
        { "name": "include", "description": { "zh": "文件过滤", "en": "File filter" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "mimo_structure"
      "description": { "zh": "项目结构：目录树、文件类型统计、关键文件", "en": "Project structure overview" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "max_depth", "description": { "zh": "深度（默认3）", "en": "Depth (default 3)" }, "type": "number", "required": false }
      ]
    },
    {
      "name": "mimo_related"
      "description": { "zh": "依赖查找：谁import了这个文件，这个文件import了谁", "en": "Find import dependencies" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "file", "description": { "zh": "目标文件（相对路径）", "en": "Target file (relative)" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "mimo_glob"
      "description": { "zh": "文件查找：按模式匹配查找文件", "en": "Find files by pattern" }
      "parameters": [
        { "name": "path", "description": { "zh": "搜索路径", "en": "Search path" }, "type": "string", "required": true }
        { "name": "pattern", "description": { "zh": "匹配模式如 *.kt, *test*py", "en": "Pattern e.g. *.kt" }, "type": "string", "required": true }
        { "name": "max_depth", "description": { "zh": "深度（默认-1无限）", "en": "Depth (-1=unlimited)" }, "type": "number", "required": false }
      ]
    },
    {
      "name": "mimo_edit"
      "description": { "zh": "代码编辑：替换文件中的指定内容", "en": "Edit code: replace content in file" }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
        { "name": "old", "description": { "zh": "要替换的旧内容", "en": "Old content to replace" }, "type": "string", "required": true }
        { "name": "new", "description": { "zh": "新内容", "en": "New content" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "mimo_write"
      "description": { "zh": "文件写入：创建或覆盖写入文件", "en": "Write file: create or overwrite" }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
        { "name": "content", "description": { "zh": "文件内容", "en": "File content" }, "type": "string", "required": true }
        { "name": "append", "description": { "zh": "是否追加（默认false覆盖）", "en": "Append mode (default false)" }, "type": "boolean", "required": false }
      ]
    }
  ]
}*/

// ====== Helpers ======

var TEXT_EXTS = '.kt.java.py.js.ts.tsx.jsx.json.xml.md.txt.yml.yaml.sh.c.cpp.h.go.rs.rb.php.swift.dart.html.css.sql.toml.ini.gradle.properties.m.mm.vue.svelte.astro.r.lua.luau.kt.kts.csharp.cs'.split('.');

function isTextFn(name) {
    var lower = name.toLowerCase();
    for (var i = 0; i < TEXT_EXTS.length; i++) { if (lower.endsWith(TEXT_EXTS[i])) return true; }
    return false;
}

function matchGlobFn(name, pattern) {
    if (!pattern) return true;
    var pats = pattern.split(',');
    for (var i = 0; i < pats.length; i++) {
        var p = pats[i].trim();
        if (p.startsWith('*.')) {
            if (name.toLowerCase().endsWith(p.substring(1).toLowerCase())) return true;
        } else if (p.startsWith('*') && p.endsWith('*')) {
            if (name.toLowerCase().indexOf(p.replace(/\*/g, '').toLowerCase()) >= 0) return true;
        } else {
            if (name.toLowerCase() === p.toLowerCase()) return true;
        }
    }
    return false;
}

function extractCtxFn(lines, idx, ctx) {
    var s = Math.max(0, idx - ctx), e = Math.min(lines.length, idx + ctx + 1), out = [];
    for (var i = s; i < e; i++) { out.push((i === idx ? '>' : ' ') + ' ' + (i+1) + ': ' + lines[i]); }
    return out.join('\n');
}

function symTypeFn(line) {
    var t = line.trim();
    if (/^fun |^def |^function |^func |^fn |^async function |^export function |^export async function /.test(t)) return 'function';
    if (/^class |^interface |^object |^struct |^enum |^type |^data class |^sealed class |^abstract class /.test(t)) return 'class';
    if (/^val |^var |^const |^let |^export const |^export let |^export var /.test(t) && /=|:/.test(t)) return 'variable';
    return 'other';
}

async function walkFn(root, maxD, depth, pattern) {
    if (maxD >= 0 && depth > maxD) return [];
    var res = [];
    try {
        var ls = await Tools.Files.list(root);
        if (!ls || !ls.entries) return res;
        for (var i = 0; i < ls.entries.length; i++) {
            var e = ls.entries[i];
            if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'build' || e.name === '.git' || e.name === '__pycache__') continue;
            var fp = root + '/' + e.name;
            if (e.isDirectory) { res = res.concat(await walkFn(fp, maxD, depth+1, pattern)); }
            else {
                if (pattern && !matchGlobFn(e.name, pattern)) continue;
                res.push({path:fp, name:e.name});
            }
        }
    } catch(ex) {}
    return res;
}

// ====== mimo_search ======

async function mimo_search(params) {
    var p = params.path, pat = params.pattern, inc = params.include || '';
    if (!p || !pat) return { success: false, message: 'path and pattern required' };
    try {
        var rx = new RegExp(pat, 'gi'), files = await walkFn(p, 8, 0), matches = [], searched = 0;
        for (var f = 0; f < files.length; f++) {
            if (inc && !matchGlobFn(files[f].name, inc)) continue;
            if (!isTextFn(files[f].name)) continue;
            searched++;
            try {
                var c = await Tools.Files.read(files[f].path);
                if (!c || !c.content) continue;
                var lines = c.content.split('\n');
                for (var ln = 0; ln < lines.length; ln++) {
                    rx.lastIndex = 0;
                    if (rx.test(lines[ln])) {
                        matches.push({file:files[f].path, line:ln+1, text:lines[ln].trim(), context:extractCtxFn(lines,ln,2)});
                    }
                }
            } catch(ex) {}
        }
        var out = 'Found ' + matches.length + ' (searched ' + searched + ' files)\n\n';
        var cf = '';
        for (var m = 0; m < Math.min(matches.length, 100); m++) {
            if (matches[m].file !== cf) { cf = matches[m].file; out += '--- ' + cf + ' ---\n'; }
            out += matches[m].context + '\n\n';
        }
        if (matches.length > 100) out += '... truncated ' + (matches.length - 100) + ' more matches\n';
        return { success: true, data: {count:matches.length, searched:searched}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== mimo_read ======

async function mimo_read(params) {
    var p = params.path, off = params.offset || 1, lim = params.limit || 200;
    if (!p) return { success: false, message: 'path required' };
    try {
        var c = await Tools.Files.read(p);
        if (!c || !c.content) return { success: false, message: 'Cannot read: ' + p };
        var all = c.content.split('\n'), start = Math.max(0, off-1), end = Math.min(all.length, start+lim);
        var out = p + ' (lines ' + (start+1) + '-' + end + ' of ' + all.length + ')\n\n';
        for (var i = start; i < end; i++) {
            var st = symTypeFn(all[i]);
            out += (st !== 'other' ? '[' + st.charAt(0).toUpperCase() + '] ' : '    ') + (i+1) + ': ' + all[i] + '\n';
        }
        if (end < all.length) out += '\n(offset=' + (end+1) + ' to continue)';
        else out += '\n(End of file, ' + all.length + ' lines)';
        return { success: true, data: {total:all.length, from:start+1, to:end}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== mimo_explore ======

async function mimo_explore(params) {
    var p = params.path, sym = params.symbol, inc = params.include || '';
    if (!p || !sym) return { success: false, message: 'path and symbol required' };
    try {
        var files = await walkFn(p, 8, 0), defs = [], refs = [];
        for (var f = 0; f < files.length; f++) {
            if (inc && !matchGlobFn(files[f].name, inc)) continue;
            if (!isTextFn(files[f].name)) continue;
            try {
                var c = await Tools.Files.read(files[f].path);
                if (!c || !c.content) continue;
                var lines = c.content.split('\n');
                for (var ln = 0; ln < lines.length; ln++) {
                    if (lines[ln].indexOf(sym) === -1) continue;
                    var st = symTypeFn(lines[ln]);
                    if (st !== 'other') { defs.push({file:files[f].path,line:ln+1,type:st,text:lines[ln].trim(),context:extractCtxFn(lines,ln,3)}); }
                    else if (new RegExp('\\b' + sym.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b').test(lines[ln])) {
                        refs.push({file:files[f].path,line:ln+1,text:lines[ln].trim()});
                    }
                }
            } catch(ex) {}
        }
        var out = '=== ' + sym + ' ===\n\n';
        if (defs.length > 0) {
            out += '## Definitions (' + defs.length + ')\n';
            for (var d = 0; d < defs.length; d++) { out += '[' + defs[d].type + '] ' + defs[d].file + ':' + defs[d].line + '\n' + defs[d].context + '\n\n'; }
        } else { out += '## Definitions: NOT FOUND\n\n'; }
        out += '## References (' + refs.length + ')\n';
        for (var r = 0; r < Math.min(refs.length,30); r++) { out += '  ' + refs[r].file + ':' + refs[r].line + '  ' + refs[r].text + '\n'; }
        if (refs.length > 30) out += '  ... ' + (refs.length - 30) + ' more\n';
        return { success: true, data: {defs:defs.length, refs:refs.length}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== mimo_structure ======

async function mimo_structure(params) {
    var p = params.path, depth = params.max_depth || 3;
    if (!p) return { success: false, message: 'path required' };
    try {
        var files = await walkFn(p, depth, 0), exts = {};
        for (var f = 0; f < files.length; f++) {
            var dot = files[f].name.lastIndexOf('.');
            var ext = dot >= 0 ? files[f].name.substring(dot) : '(none)';
            exts[ext] = (exts[ext]||0) + 1;
        }
        var sorted = Object.keys(exts).sort(function(a,b){return exts[b]-exts[a];});
        var out = p + '\nFiles: ' + files.length + '\n\nTypes:\n';
        for (var s = 0; s < sorted.length; s++) { out += '  ' + sorted[s] + ': ' + exts[sorted[s]] + '\n'; }
        out += '\nKey Files:\n';
        var keys = ['README.md','package.json','build.gradle.kts','settings.gradle.kts','Cargo.toml','go.mod','pom.xml','AndroidManifest.xml','pyproject.toml','Makefile','CMakeLists.txt'];
        for (var k = 0; k < files.length; k++) { if (keys.indexOf(files[k].name) >= 0) out += '  ' + files[k].path + '\n'; }
        return { success: true, data: {total:files.length, exts:exts}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== mimo_related ======

async function mimo_related(params) {
    var p = params.path, f = params.file;
    if (!p || !f) return { success: false, message: 'path and file required' };
    try {
        var fp = p + '/' + f, tc = await Tools.Files.read(fp);
        if (!tc || !tc.content) return { success: false, message: 'Cannot read: ' + fp };
        var base = f.split('/').pop().replace(/\.[^.]+$/,''), lines = tc.content.split('\n'), impFrom = [];
        for (var i = 0; i < lines.length; i++) {
            var t = lines[i].trim();
            if (/^import |^from |^#include/.test(t)) impFrom.push({line:i+1, raw:t});
        }
        var impBy = [], files = await walkFn(p, 8, 0);
        for (var fi = 0; fi < files.length; fi++) {
            if (files[fi].path === fp || !isTextFn(files[fi].name)) continue;
            try {
                var c = await Tools.Files.read(files[fi].path);
                if (!c || !c.content) continue;
                var fl = c.content.split('\n');
                for (var ln = 0; ln < fl.length; ln++) {
                    if (fl[ln].indexOf(base) >= 0 && /^import |^from |^#include/.test(fl[ln].trim())) {
                        impBy.push({file:files[fi].path, line:ln+1, raw:fl[ln].trim()}); break;
                    }
                }
            } catch(ex) {}
        }
        var out = '=== ' + f + ' ===\n\nImports (' + impFrom.length + '):\n';
        for (var im = 0; im < impFrom.length; im++) out += '  L' + impFrom[im].line + ': ' + impFrom[im].raw + '\n';
        out += '\nImported By (' + impBy.length + '):\n';
        for (var ib = 0; ib < impBy.length; ib++) out += '  ' + impBy[ib].file + ':' + impBy[ib].line + '\n';
        return { success: true, data: {imports:impFrom.length, dependents:impBy.length}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== mimo_glob ======

async function mimo_glob(params) {
    var p = params.path, pattern = params.pattern, depth = params.max_depth !== undefined ? params.max_depth : -1;
    if (!p || !pattern) return { success: false, message: 'path and pattern required' };
    try {
        var files = await walkFn(p, depth, 0, pattern);
        var out = 'Found ' + files.length + ' files matching "' + pattern + '":\n\n';
        for (var i = 0; i < files.length; i++) { out += '  ' + files[i].path + '\n'; }
        return { success: true, data: {count:files.length, files:files.map(function(f){return f.path;})}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== mimo_edit ======

async function mimo_edit(params) {
    var p = params.path, old = params.old, nw = params['new'];
    if (!p || old === undefined || nw === undefined) return { success: false, message: 'path, old, and new required' };
    try {
        var c = await Tools.Files.read(p);
        if (!c || !c.content) return { success: false, message: 'Cannot read: ' + p };
        if (c.content.indexOf(old) === -1) return { success: false, message: 'Old content not found in file' };
        var newContent = c.content.replace(old, nw);
        await Tools.Files.write(p, newContent, false);
        return { success: true, data: {path:p, replaced:true}, message: 'Edited ' + p };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== mimo_write ======

async function mimo_write(params) {
    var p = params.path, content = params.content, append = params.append === true;
    if (!p || content === undefined) return { success: false, message: 'path and content required' };
    try {
        await Tools.Files.write(p, content, append);
        return { success: true, data: {path:p, append:append}, message: (append ? 'Appended to ' : 'Wrote ') + p };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// ====== Entry point ======

var __FUNCS = { 
    mimo_search: mimo_search, 
    mimo_read: mimo_read,
    mimo_explore: mimo_explore, 
    mimo_structure: mimo_structure, 
    mimo_related: mimo_related,
    mimo_glob: mimo_glob,
    mimo_edit: mimo_edit,
    mimo_write: mimo_write
};

var __fnName = (typeof params !== 'undefined' && params['function']) ? params['function'] : 'mimo_search';
var __fnParams = (typeof params !== 'undefined' && params['params']) ? params['params'] : ((typeof params !== 'undefined') ? params : {});
delete __fnParams['__operit_inline_function_name'];
delete __fnParams['__operit_inline_function_source'];
delete __fnParams['__operit_package_lang'];
delete __fnParams['function'];

if (__FUNCS[__fnName]) {
    var __result = await __FUNCS[__fnName](__fnParams);
    complete(__result);
} else {
    complete({ success: false, message: 'Unknown function: ' + __fnName + '. Available: ' + Object.keys(__FUNCS).join(', ') });
}