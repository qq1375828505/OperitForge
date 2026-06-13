/*
METADATA
{
  "name": "mimo_code"
  "version": "1.3.0"

  "display_name": {
    "zh": "MiMo代码工具"
    "en": "MiMo Code Tools"
  }
  "description": {
    "zh": "MiMo Code 代码理解工具包：搜索、读取、深度探索、文件理解、文件查找、编辑、写入"
    "en": "MiMo Code toolkit: search, read, explore, understand, glob, edit, write"
  }
  "enabledByDefault": true
  "category": "Development"
  "tools": [
    {
      "name": "mimo_search"
      "description": {
        "zh": "代码搜索：正则匹配+上下文行显示"
        "en": "Code search with regex and context"
      }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "pattern", "description": { "zh": "正则模式", "en": "Regex pattern" }, "type": "string", "required": true }
        { "name": "include", "description": { "zh": "文件过滤如 *.kt", "en": "File filter e.g. *.kt" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "mimo_read"
      "description": {
        "zh": "智能代码读取：带行号、符号标注、分页"
        "en": "Smart code read with line numbers and symbol labels"
      }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
        { "name": "offset", "description": { "zh": "起始行号（从1开始）", "en": "Start line (1-indexed)" }, "type": "number", "required": false }
        { "name": "limit", "description": { "zh": "读取行数（默认200）", "en": "Line count (default 200)" }, "type": "number", "required": false }
      ]
    },
    {
      "name": "mimo_explore"
      "description": {
        "zh": "深度代码理解：符号签名提取、定义位置、所有引用、调用者追踪、类成员结构"
        "en": "Deep code understanding: signatures, definitions, references, callers, class members"
      }
      "parameters": [
        { "name": "path", "description": { "zh": "项目路径", "en": "Project path" }, "type": "string", "required": true }
        { "name": "symbol", "description": { "zh": "符号名（函数/类/变量）", "en": "Symbol name (function/class/variable)" }, "type": "string", "required": true }
        { "name": "include", "description": { "zh": "文件过滤", "en": "File filter" }, "type": "string", "required": false }
      ]
    },
    {
      "name": "mimo_understand"
      "description": {
        "zh": "文件结构分析：所有类/函数/变量列表、继承关系、import依赖、代码行数统计"
        "en": "File structure analysis: classes, functions, variables, inheritance, imports"
      }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "mimo_glob"
      "description": {
        "zh": "文件查找：按模式匹配查找文件"
        "en": "Find files by pattern"
      }
      "parameters": [
        { "name": "path", "description": { "zh": "搜索路径", "en": "Search path" }, "type": "string", "required": true }
        { "name": "pattern", "description": { "zh": "匹配模式如 *.kt", "en": "Pattern e.g. *.kt" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "mimo_edit"
      "description": {
        "zh": "代码编辑：替换文件中的指定内容"
        "en": "Edit code: replace content in file"
      }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
        { "name": "old", "description": { "zh": "要替换的旧内容", "en": "Old content to replace" }, "type": "string", "required": true }
        { "name": "new", "description": { "zh": "新内容", "en": "New content" }, "type": "string", "required": true }
      ]
    },
    {
      "name": "mimo_write"
      "description": {
        "zh": "文件写入：创建或覆盖写入文件"
        "en": "Write file: create or overwrite"
      }
      "parameters": [
        { "name": "path", "description": { "zh": "文件路径", "en": "File path" }, "type": "string", "required": true }
        { "name": "content", "description": { "zh": "文件内容", "en": "File content" }, "type": "string", "required": true }
        { "name": "append", "description": { "zh": "是否追加（默认false覆盖）", "en": "Append mode (default false)" }, "type": "boolean", "required": false }
      ]
    }
  ]
}*/

// ====== Helpers ======
var EX = '.kt.java.py.js.ts.tsx.jsx.json.xml.md.txt.yml.yaml.sh.c.cpp.h.go.rs.rb.php.swift.dart.html.css.sql.toml.ini.gradle.properties.m.mm.vue.svelte.astro.r.lua.luau.kts.cs'.split('.');
function isT(n){var l=n.toLowerCase();for(var i=0;i<EX.length;i++){if(l.endsWith(EX[i]))return true;}return false;}
function mG(n,p){if(!p)return true;var ps=p.split(',');for(var i=0;i<ps.length;i++){var x=ps[i].trim();if(x.startsWith('*.')){if(n.toLowerCase().endsWith(x.substring(1).toLowerCase()))return true;}else if(n.toLowerCase().indexOf(x.replace(/\*/g,'').toLowerCase())>=0)return true;}return false;}
function cF(ls,idx,c){var s=Math.max(0,idx-c),e=Math.min(ls.length,idx+c+1),o=[];for(var i=s;i<e;i++){o.push((i===idx?'>':' ')+' '+(i+1)+': '+ls[i]);}return o.join('\n');}
function gL(fp){var d=fp.lastIndexOf('.');return d>=0?fp.substring(d):'';}

async function wk(root,md,d,p){if(md>=0&&d>md)return [];var r=[];try{var ls=await Tools.Files.list(root);if(!ls||!ls.entries)return r;for(var i=0;i<ls.entries.length;i++){var e=ls.entries[i];if(e.name.startsWith('.')||e.name==='node_modules'||e.name==='build'||e.name==='.git'||e.name==='__pycache__')continue;var fp=root+'/'+e.name;if(e.isDirectory){r=r.concat(await wk(fp,md,d+1,p));}else{if(p&&!mG(e.name,p))continue;r.push({path:fp,name:e.name});}}}catch(ex){}return r;}

function eS(ln2,lang){
var t=ln2.trim(),s={raw:t,mods:[],name:'',params:'',ret:'',type:'other'};
if(/\.kt$|\.java$|\.kts$/.test(lang)){
var fm=t.match(/fun\s+(\w+)\s*\(([^)]*)\)\s*(?::\s*(\S+))?/);
if(fm){s.type='function';s.name=fm[1];s.params=fm[2].trim();s.ret=fm[3]||'';return s;}
var cm=t.match(/(class|interface|object|enum class|sealed class|data class|abstract class|open class)\s+(\w+)(?:[^:]*:\s*(.+))?/);
if(cm){s.type='class';s.name=cm[2];s.ret=(cm[3]||'').replace(/\{.*$/,'').trim();return s;}
var pm=t.match(/(val|var)\s+(\w+)\s*(?::\s*(\S+))?/);
if(pm){s.type='property';s.name=pm[2];s.ret=pm[3]||'';return s;}
}
if(/\.py$/.test(lang)){
var dm=t.match(/^(async\s+)?def\s+(\w+)\s*\(([^)]*)\)\s*(?:->\s*(\S+))?/);
if(dm){s.type='function';s.name=dm[2];s.params=dm[3].trim();s.ret=dm[4]||'';return s;}
var pc=t.match(/^class\s+(\w+)(?:\s*\(([^)]*)\))?/);
if(pc){s.type='class';s.name=pc[1];s.ret=pc[2]||'';return s;}
}
if(/\.js$|\.ts$|\.tsx$|\.jsx$/.test(lang)){
var jm=t.match(/^(export\s+)?(async\s+)?function\s+(\w+)\s*\(([^)]*)\)/);
if(jm){s.type='function';s.name=jm[3];s.params=jm[4].trim();return s;}
var jc=t.match(/^class\s+(\w+)(?:\s+extends\s+(\w+))?/);
if(jc){s.type='class';s.name=jc[1];s.ret=jc[2]||'';return s;}
}
if(/\.go$/.test(lang)){
var gf=t.match(/^func\s+(?:\((\w+)\s+\*?(\w+)\)\s+)?(\w+)\s*\(([^)]*)\)/);
if(gf){s.type='function';s.name=gf[3];s.params=gf[4].trim();return s;}
}
if(/\.rs$/.test(lang)){
var rf=t.match(/^(pub\s+)?(async\s+)?fn\s+(\w+)/);
if(rf){s.type='function';s.name=rf[3];return s;}
}
var gm=t.match(/(?:fun|def|function|func|fn)\s+(\w+)/);
if(gm){s.type='function';s.name=gm[1];return s;}
var gc=t.match(/(?:class|interface|struct|enum|type)\s+(\w+)/);
if(gc){s.type='class';s.name=gc[1];return s;}
return s;
}

function eCM(lines,classLine,lang){
var m={methods:[],properties:[]};
for(var i=classLine+1;i<Math.min(classLine+80,lines.length);i++){
if(lines[i].trim()==='')continue;
var sig=eS(lines[i],lang);
if(sig.type==='function')m.methods.push({line:i+1,name:sig.name,params:sig.params,ret:sig.ret});
else if(sig.type==='property')m.properties.push({line:i+1,name:sig.name,ret:sig.ret});
}
return m;
}

async function mimo_search(params){
var p=params.path,pat=params.pattern,inc=params.include||'';
if(!p||!pat)return{success:false,message:'path and pattern required'};
try{
var rx=new RegExp(pat,'gi'),files=await wk(p,8,0),matches=[],searched=0;
for(var f=0;f<files.length;f++){
if(inc&&!mG(files[f].name,inc))continue;
if(!isT(files[f].name))continue;
searched++;
try{var c=await Tools.Files.read(files[f].path);if(!c||!c.content)continue;var ls=c.content.split('\n');
for(var ln=0;ln<ls.length;ln++){rx.lastIndex=0;if(rx.test(ls[ln]))matches.push({file:files[f].path,line:ln+1,ctx:cF(ls,ln,2)});}}catch(ex){}
}
var out='Found '+matches.length+' (searched '+searched+' files)\n\n';
var cf='';
for(var m=0;m<Math.min(matches.length,80);m++){if(matches[m].file!==cf){cf=matches[m].file;out+='--- '+cf+' ---\n';}out+=matches[m].ctx+'\n\n';}
if(matches.length>80)out+='... +'+(matches.length-80)+' more\n';
return{success:true,data:{count:matches.length,searched:searched},message:out};
}catch(e){return{success:false,message:'Error: '+e.message};}
}

async function mimo_read(params){
var p=params.path,off=params.offset||1,lim=params.limit||200;
if(!p)return{success:false,message:'path required'};
try{var c=await Tools.Files.read(p);if(!c||!c.content)return{success:false,message:'Cannot read: '+p};
var all=c.content.split('\n'),start=Math.max(0,off-1),end=Math.min(all.length,start+lim);
var lang=gL(p),out=p+' (lines '+(start+1)+'-'+end+' of '+all.length+')\n\n';
for(var i=start;i<end;i++){var sig=eS(all[i],lang);var lb=sig.type!=='other'?'['+sig.type.charAt(0).toUpperCase()+'] ':'    ';out+=lb+(i+1)+': '+all[i]+'\n';}
if(end<all.length)out+='\n(offset='+(end+1)+' to continue)';else out+='\n(End of file, '+all.length+' lines)';
return{success:true,data:{total:all.length,from:start+1,to:end},message:out};
}catch(e){return{success:false,message:'Error: '+e.message};}
}

async function mimo_explore(params){
var p=params.path,sym=params.symbol,inc=params.include||'';
if(!p||!sym)return{success:false,message:'path and symbol required'};
try{
var files=await wk(p,8,0),defs=[],refs=[],callers=[];
for(var f=0;f<files.length;f++){
if(inc&&!mG(files[f].name,inc))continue;
if(!isT(files[f].name))continue;
try{var c=await Tools.Files.read(files[f].path);if(!c||!c.content)continue;
var ls=c.content.split('\n'),lang=gL(files[f].path);
for(var ln=0;ln<ls.length;ln++){
if(ls[ln].indexOf(sym)===-1)continue;
var sig=eS(ls[ln],lang);
if(sig.type!=='other'&&sig.name===sym){
var body=[];for(var bl=ln;bl<Math.min(ln+25,ls.length);bl++){body.push((bl+1)+': '+ls[bl]);}
var members=sig.type==='class'?eCM(ls,ln,lang):null;
defs.push({file:files[f].path,line:ln+1,sig:sig,body:body.join('\n'),members:members});
}else if(new RegExp('\\b'+sym.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b').test(ls[ln])){
var csig=eS(ls[ln],lang);
if(csig.type==='function'&&ls[ln].indexOf(sym+'(')>=0)callers.push({file:files[f].path,line:ln+1,caller:csig.name,text:ls[ln].trim()});
refs.push({file:files[f].path,line:ln+1,text:ls[ln].trim()});
}
}}catch(ex){}
}
var out='=== '+sym+' ===\n\n';
if(defs.length>0){
out+='## Definitions ('+defs.length+')\n\n';
for(var d=0;d<defs.length;d++){var df=defs[d];out+='['+df.sig.type.toUpperCase()+'] '+df.file+':'+df.line+'\n';
if(df.sig.type==='function'){out+='  Signature: '+sym;if(df.sig.params)out+='('+df.sig.params+')';if(df.sig.ret)out+=' -> '+df.sig.ret;out+='\n';}
else if(df.sig.type==='class'){out+='  Class: '+sym;if(df.sig.ret)out+=' : '+df.sig.ret;out+='\n';
if(df.members){if(df.members.methods.length>0){out+='  Methods ('+df.members.methods.length+'):\n';for(var mi=0;mi<df.members.methods.length;mi++){var mm=df.members.methods[mi];out+='    L'+mm.line+' '+mm.name+'('+(mm.params||'')+')'+(mm.ret?' -> '+mm.ret:'')+'\n';}}
if(df.members.properties.length>0){out+='  Properties ('+df.members.properties.length+'):\n';for(var pi=0;pi<df.members.properties.length;pi++){var pr=df.members.properties[pi];out+='    L'+pr.line+' '+(pr.name||'')+(pr.ret?': '+pr.ret:'')+'\n';}}}}
out+='\n  Body:\n'+df.body+'\n\n';}
}else{out+='## Definitions: NOT FOUND\n\n';}
if(callers.length>0){out+='## Callers ('+callers.length+')\n';for(var ci=0;ci<Math.min(callers.length,20);ci++){out+='  '+callers[ci].file+':'+callers[ci].line+'  '+callers[ci].caller+'() -> '+sym+'\n';}if(callers.length>20)out+='  ... +'+(callers.length-20)+' more\n';out+='\n';}
out+='## References ('+refs.length+')\n';for(var r=0;r<Math.min(refs.length,25);r++){out+='  '+refs[r].file+':'+refs[r].line+'  '+refs[r].text.substring(0,120)+'\n';}if(refs.length>25)out+='  ... +'+(refs.length-25)+' more\n';
return{success:true,data:{symbol:sym,defs:defs.length,callers:callers.length,refs:refs.length},message:out};
}catch(e){return{success:false,message:'Error: '+e.message};}
}

async function mimo_understand(params){
var p=params.path;if(!p)return{success:false,message:'path required'};
try{var c=await Tools.Files.read(p);if(!c||!c.content)return{success:false,message:'Cannot read: '+p};
var ls=c.content.split('\n'),lang=gL(p),fns=[],cls=[],props=[],imps=[];
for(var i=0;i<ls.length;i++){var line=ls[i];if(line.trim()==='')continue;
if(/^import |^from |^#include|^require\(/.test(line.trim()))imps.push({line:i+1,text:line.trim()});
var sig=eS(line,lang);
if(sig.type==='function')fns.push({line:i+1,name:sig.name,params:sig.params,ret:sig.ret});
else if(sig.type==='class')cls.push({line:i+1,name:sig.name,extends:sig.ret});
else if(sig.type==='property')props.push({line:i+1,name:sig.name,type:sig.ret});
}
var out='=== '+p+' ===\nLines: '+ls.length+' | Lang: '+(lang||'unknown')+'\n\n';
if(imps.length>0){out+='## Imports ('+imps.length+')\n';for(var im=0;im<imps.length;im++)out+='  L'+imps[im].line+': '+imps[im].text.substring(0,100)+'\n';out+='\n';}
if(cls.length>0){out+='## Classes ('+cls.length+')\n';for(var cl=0;cl<cls.length;cl++){out+='  L'+cls[cl].line+' '+cls[cl].name;if(cls[cl].extends)out+=' : '+cls[cl].extends;out+='\n';}out+='\n';}
if(fns.length>0){out+='## Functions ('+fns.length+')\n';for(var fi=0;fi<fns.length;fi++){var fn=fns[fi];out+='  L'+fn.line+' '+fn.name+'('+(fn.params||'')+')';if(fn.ret)out+=' -> '+fn.ret;out+='\n';}out+='\n';}
if(props.length>0){out+='## Properties ('+props.length+')\n';for(var pi2=0;pi2<Math.min(props.length,30);pi2++){out+='  L'+props[pi2].line+' '+props[pi2].name;if(props[pi2].type)out+=': '+props[pi2].type;out+='\n';}if(props.length>30)out+='  ... +'+(props.length-30)+' more\n';out+='\n';}
out+='## Summary: '+cls.length+' class, '+fns.length+' function, '+props.length+' property, '+imps.length+' import\n';
return{success:true,data:{classes:cls.length,functions:fns.length,properties:props.length,imports:imps.length,totalLines:ls.length},message:out};
}catch(e){return{success:false,message:'Error: '+e.message};}
}

async function mimo_glob(params){
var p=params.path,pat=params.pattern;if(!p||!pat)return{success:false,message:'path and pattern required'};
try{var files=await wk(p,-1,0,pat);
var out='Found '+files.length+' matching "'+pat+'":\n\n';for(var i=0;i<files.length;i++)out+='  '+files[i].path+'\n';
return{success:true,data:{count:files.length},message:out};
}catch(e){return{success:false,message:'Error: '+e.message};}
}

async function mimo_edit(params){
var p=params.path,old=params.old,nw=params['new'];
if(!p||old===undefined||nw===undefined)return{success:false,message:'path, old, new required'};
try{var c=await Tools.Files.read(p);if(!c||!c.content)return{success:false,message:'Cannot read: '+p};
if(c.content.indexOf(old)===-1)return{success:false,message:'Old content not found'};
await Tools.Files.write(p,c.content.replace(old,nw),false);
return{success:true,message:'Edited '+p};
}catch(e){return{success:false,message:'Error: '+e.message};}
}

async function mimo_write(params){
var p=params.path,content=params.content,append=params.append===true;
if(!p||content===undefined)return{success:false,message:'path and content required'};
try{await Tools.Files.write(p,content,append);return{success:true,message:(append?'Appended to ':'Wrote ')+p};
}catch(e){return{success:false,message:'Error: '+e.message};}
}
