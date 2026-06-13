/*
METADATA
{
  "name": "code_graph"
  "version": "1.0.0"
  "display_name": { "zh": "代码图谱", "en": "Code Graph" }
  "description": { "zh": "代码智能工具包", "en": "Code intelligence toolkit" }
  "enabledByDefault": true
  "category": "Development"
  "tools": [
    {
      "name": "code_search"
      "description": { "zh": "代码搜索", "en": "Search code" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "pattern", "description": { "zh": "正则模式", "en": "Regex pattern" }, "type": "string", "required": true }
        { "name": "include", "description": { "zh": "文件过滤", "en": "File filter" }, "type": "string", "required": false }
        { "name": "max_results", "description": { "zh": "最大结果", "en": "Max results" }, "type": "number", "required": false }
      ]
    },
    {
      "name": "code_explore"
      "description": { "zh": "符号探索", "en": "Explore symbol" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "symbol", "description": { "zh": "符号名", "en": "Symbol name" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "code_structure"
      "description": { "zh": "项目结构", "en": "Project structure" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "max_depth", "description": { "zh": "深度", "en": "Depth" }, "type": "number", "required": false }
      ]
    },
    {
      "name": "code_related"
      "description": { "zh": "依赖查找", "en": "Find related" }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "file", "description": { "zh": "目标文件", "en": "Target file" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "code_read"
      "description": { "zh": "智能读取", "en": "Smart read" }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
        { "name": "offset", "description": { "zh": "起始行", "en": "Offset" }, "type": "number", "required": false }
        { "name": "limit", "description": { "zh": "行数", "en": "Limit" }, "type": "number", "required": false }
      ]
    }
  ]
}*/

// Helpers
var TEXT_EXTS = '.kt.java.py.js.ts.tsx.jsx.json.xml.md.txt.yml.yaml.sh.c.cpp.h.go.rs.rb.php.swift.dart.html.css.sql.toml.ini.gradle.properties.m.mm.vue.svelte.astro'.split('.');

function isText(name) {
    var lower = name.toLowerCase();
    for (var i = 0; i < TEXT_EXTS.length; i++) { if (lower.endsWith(TEXT_EXTS[i])) return true; }
    return false;
}

function matchGlob(name, pattern) {
    if (!pattern) return true;
    var pats = pattern.split(',');
    for (var i = 0; i < pats.length; i++) {
        var ext = pats[i].trim().replace('*', '');
        if (ext === '' || name.toLowerCase().endsWith(ext.toLowerCase())) return true;
    }
    return false;
}

function extractCtx(lines, idx, ctx) {
    var s = Math.max(0, idx - ctx), e = Math.min(lines.length, idx + ctx + 1), out = [];
    for (var i = s; i < e; i++) { out.push((i === idx ? '>' : ' ') + ' ' + (i+1) + ': ' + lines[i]); }
    return out.join('\n');
}

function symType(line) {
    var t = line.trim();
    if (/fun |def |function |func |fn /.test(t)) return 'function';
    if (/class |interface |object |struct |enum |type /.test(t)) return 'class';
    if (/val |var |const |let /.test(t) && /=|:/.test(t)) return 'variable';
    return 'other';
}

async function walk(root, maxD, depth) {
    if (depth > maxD) return [];
    var res = [];
    try {
        var ls = await Tools.Files.list(root);
        if (!ls || !ls.entries) return res;
        for (var i = 0; i < ls.entries.length; i++) {
            var e = ls.entries[i];
            if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'build' || e.name === '.git') continue;
            var fp = root + '/' + e.name;
            if (e.isDirectory) { res = res.concat(await walk(fp, maxD, depth+1)); }
            else { res.push({path:fp, name:e.name}); }
        }
    } catch(ex) {}
    return res;
}

// code_search
async function code_search(params) {
    var p = params.path, pat = params.pattern, inc = params.include || '', max = params.max_results || 50;
    if (!p || !pat) return { success: false, message: 'path and pattern required' };
    try {
        var rx = new RegExp(pat, 'gi'), files = await walk(p, 8, 0), matches = [], searched = 0;
        for (var f = 0; f < files.length && matches.length < max; f++) {
            if (inc && !matchGlob(files[f].name, inc)) continue;
            if (!isText(files[f].name)) continue;
            searched++;
            try {
                var c = await Tools.Files.read(files[f].path);
                if (!c || !c.content) continue;
                var lines = c.content.split('\n');
                for (var ln = 0; ln < lines.length && matches.length < max; ln++) {
                    rx.lastIndex = 0;
                    if (rx.test(lines[ln])) {
                        matches.push({file:files[f].path, line:ln+1, text:lines[ln].trim(), context:extractCtx(lines,ln,2)});
                    }
                }
            } catch(ex) {}
        }
        var out = 'Found ' + matches.length + ' (searched ' + searched + ' files)\n\n';
        var cf = '';
        for (var m = 0; m < matches.length; m++) {
            if (matches[m].file !== cf) { cf = matches[m].file; out += '--- ' + cf + ' ---\n'; }
            out += matches[m].context + '\n\n';
        }
        return { success: true, data: {count:matches.length, searched:searched}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// code_explore
async function code_explore(params) {
    var p = params.path, sym = params.symbol;
    if (!p || !sym) return { success: false, message: 'path and symbol required' };
    try {
        var files = await walk(p, 8, 0), defs = [], refs = [];
        for (var f = 0; f < files.length; f++) {
            if (!isText(files[f].name)) continue;
            try {
                var c = await Tools.Files.read(files[f].path);
                if (!c || !c.content) continue;
                var lines = c.content.split('\n');
                for (var ln = 0; ln < lines.length; ln++) {
                    if (lines[ln].indexOf(sym) === -1) continue;
                    var st = symType(lines[ln]);
                    if (st !== 'other') { defs.push({file:files[f].path,line:ln+1,type:st,text:lines[ln].trim(),context:extractCtx(lines,ln,3)}); }
                    else if (new RegExp('\\b' + sym.replace(/[.*+?^${}()|[\]\\]/g,'\\$&') + '\\b').test(lines[ln])) {
                        refs.push({file:files[f].path,line:ln+1,text:lines[ln].trim()});
                    }
                }
            } catch(ex) {}
        }
        var out = '=== Explore: ' + sym + ' ===\n\n';
        out += '## Definitions (' + defs.length + ')\n';
        for (var d = 0; d < defs.length; d++) { out += '[' + defs[d].type + '] ' + defs[d].file + ':' + defs[d].line + '\n' + defs[d].context + '\n\n'; }
        out += '## References (' + refs.length + ')\n';
        for (var r = 0; r < Math.min(refs.length,30); r++) { out += refs[r].file + ':' + refs[r].line + '  ' + refs[r].text + '\n'; }
        return { success: true, data: {defs:defs.length, refs:refs.length}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// code_structure
async function code_structure(params) {
    var p = params.path, depth = params.max_depth || 3;
    if (!p) return { success: false, message: 'path required' };
    try {
        var files = await walk(p, depth, 0), exts = {};
        for (var f = 0; f < files.length; f++) {
            var dot = files[f].name.lastIndexOf('.');
            var ext = dot >= 0 ? files[f].name.substring(dot) : '(none)';
            exts[ext] = (exts[ext]||0) + 1;
        }
        var sorted = Object.keys(exts).sort(function(a,b){return exts[b]-exts[a];});
        var out = '=== Structure: ' + p + ' ===\nFiles: ' + files.length + '\n\n## Types\n';
        for (var s = 0; s < sorted.length; s++) { out += '  ' + sorted[s] + ': ' + exts[sorted[s]] + '\n'; }
        out += '\n## Key Files\n';
        var keys = ['README.md','package.json','build.gradle.kts','settings.gradle.kts','Cargo.toml','go.mod','pom.xml','AndroidManifest.xml'];
        for (var k = 0; k < files.length; k++) { if (keys.indexOf(files[k].name) >= 0) out += '  ' + files[k].path + '\n'; }
        return { success: true, data: {total:files.length, exts:exts}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// code_related
async function code_related(params) {
    var p = params.path, f = params.file;
    if (!p || !f) return { success: false, message: 'path and file required' };
    try {
        var fp = p + '/' + f, tc = await Tools.Files.read(fp);
        if (!tc || !tc.content) return { success: false, message: 'Cannot read: ' + fp };
        var base = f.split('/').pop().replace(/\.[^.]+$/,''), lines = tc.content.split('\n'), impFrom = [];
        for (var i = 0; i < lines.length; i++) {
            var t = lines[i].trim();
            if (/^import|^from|^#include/.test(t)) impFrom.push({line:i+1, raw:t});
        }
        var impBy = [], files = await walk(p, 8, 0);
        for (var fi = 0; fi < files.length; fi++) {
            if (files[fi].path === fp || !isText(files[fi].name)) continue;
            try {
                var c = await Tools.Files.read(files[fi].path);
                if (!c || !c.content) continue;
                var fl = c.content.split('\n');
                for (var ln = 0; ln < fl.length; ln++) {
                    if (fl[ln].indexOf(base) >= 0 && /^import|^from|^#include/.test(fl[ln].trim())) {
                        impBy.push({file:files[fi].path, line:ln+1, raw:fl[ln].trim()}); break;
                    }
                }
            } catch(ex) {}
        }
        var out = '=== Related: ' + f + ' ===\n\n## Imports (' + impFrom.length + ')\n';
        for (var im = 0; im < impFrom.length; im++) out += '  L' + impFrom[im].line + ': ' + impFrom[im].raw + '\n';
        out += '\n## Imported By (' + impBy.length + ')\n';
        for (var ib = 0; ib < impBy.length; ib++) out += '  ' + impBy[ib].file + ':' + impBy[ib].line + '\n';
        return { success: true, data: {imports:impFrom.length, dependents:impBy.length}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// code_read
async function code_read(params) {
    var p = params.path, off = params.offset || 1, lim = params.limit || 100;
    if (!p) return { success: false, message: 'path required' };
    try {
        var c = await Tools.Files.read(p);
        if (!c || !c.content) return { success: false, message: 'Cannot read: ' + p };
        var all = c.content.split('\n'), start = Math.max(0, off-1), end = Math.min(all.length, start+lim);
        var out = '=== ' + p + ' === Lines ' + (start+1) + '-' + end + ' of ' + all.length + '\n\n';
        for (var i = start; i < end; i++) {
            var st = symType(all[i]);
            out += (st !== 'other' ? '[' + st.charAt(0).toUpperCase() + '] ' : '    ') + (i+1) + ': ' + all[i] + '\n';
        }
        if (end < all.length) out += '\n(offset=' + (end+1) + ' to continue)';
        else out += '\n(End of file)';
        return { success: true, data: {total:all.length, from:start+1, to:end}, message: out };
    } catch(e) { return { success: false, message: 'Error: ' + e.message }; }
}

// Entry point for debug_run_sandbox_script
// Sandbox passes params_json as the 'params' global variable
var __FUNCS = { code_search: code_search, code_explore: code_explore, code_structure: code_structure, code_related: code_related, code_read: code_read };
var __fnName = (typeof params !== 'undefined' && params['function']) ? params['function'] : 'code_search';
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