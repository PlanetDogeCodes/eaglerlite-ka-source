/* EaglerLite v2.1 KA Launcher JS - external CDN-loaded launcher for the Khan Academy iframe port.
   Loaded via <script src="https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-launcher.js?v=2.1.1">.
   Architecture: launchGame() builds a srcdoc game frame whose inline boot script sets window.eaglercraftXOpts,
   injects the config, then sequentially <script src>-loads CLIENT_CHUNK_URLS (jsDelivr, script-src CDN-legal;
   each chunk appends one escaped fragment into window.__eag112Src). The boot script reassembles the fragments
   and executes the genuine Eaglercraft 1.12.2 client via document.createElement('script') + textContent - NO
   eval, NO blob URLs, NO network request APIs of any kind, so KA's connect-src restrictions are never
   touched and zero CSP console violations are produced (no proxy runtime of any kind). An inline
   EaglerLiteOptimizer(CFG) (serialized with toString(), perf/QoL subset only) runs BEFORE the client.
   Readiness handshake: the frame posts {type:'eaglerlite-ready'|'eaglerlite-fail', gameVersion:'1.12.2',
   source:'ka-chunks'} to the parent (screenChanged hook + canvas poller, 500ms x 300 tries); a 120s watchdog
   reveals the manual paste box (raw Eaglercraft_1.12.js source as offline fallback) on timeout.
   window.parent.__eag112TestChunks (array of chunk strings) enables pre-deploy chunk testing on the real KA
   page. Round 6: keyboard focus acquisition (in-frame hidden capture input + mousedown/pointerlockchange
   window.focus() grabs + canvas tabIndex, focus on runtime-ready, parent keydown/keyup/keypress relay that
   re-dispatches keys into the frame as synthetic KeyboardEvents), complete-texture safety (generateMipmap
   pass-through instead of a no-op stub), fullbright shader patch compile-guarded with dual-form matching,
   equal-size-only bufferSubData reallocation (prevents partial vertex-upload zero-wipes that blackened HUD
   status icons), and a 120s launch watchdog. Includes cleanup(), config/profile/theme/timeline/history/banner/kbd systems, per-field guarded DOM
   reads, null-guarded status/progress/busy writers, and defensive error capture (window.onerror +
   unhandledrejection, capture=true, recorded without console output). gameVersion is hard-coded to 1.12.2.
   Vanilla ES5. No inline comments below this block. */
'use strict';
(function() {
  'use strict';
  var _errs = window.__eaglerliteErrors = window.__eaglerliteErrors || [];
  var _csp = window.__eaglerliteCSP = window.__eaglerliteCSP || {
    localStorage: 'unknown', cdn: 'unknown'
  };
  var _mem = (typeof Map !== 'undefined') ? new Map() : null;
  window.__eaglerliteMemStore = _mem;
  function _toast(msg, type) {
    try {
      if (typeof window.showToast === 'function') { window.showToast(msg, type); return; }
    } catch(_) {}
    try {
      var stack = document.getElementById('toastStack');
      if (!stack) return;
      var t = document.createElement('div');
      t.className = 'toast-item ' + (type || '');
      t.textContent = String(msg);
      stack.appendChild(t);
      try { t.offsetWidth; } catch(_) {}
      try { t.classList.add('show'); } catch(_) {}
      var ttl = type === 'err' ? 6000 : 3000;
      setTimeout(function() {
        try { t.classList.remove('show'); } catch(_) {}
        setTimeout(function() { try { if (t.parentNode) t.parentNode.removeChild(t); } catch(_) {} }, 300);
      }, ttl);
    } catch(_) {}
  }
  window.__eaglerliteToast = _toast;
  function _report(e, ctx) {
    try {
      var errObj = {
        msg: (e && e.message) ? e.message : String(e),
        stack: (e && e.stack) ? String(e.stack).slice(0, 2000) : '',
        time: Date.now(),
        ctx: ctx || ''
      };
      _errs.push(errObj);
      while (_errs.length > 50) _errs.shift();
      _toast((ctx ? '[' + ctx + '] ' : '') + errObj.msg, 'err');
      try {
        var bse = document.getElementById('bootstrapError');
        if (bse) {
          var cur = bse.textContent || '';
          bse.textContent = (cur ? cur + '\n' : '') + '[' + (ctx || 'error') + '] ' + errObj.msg;
          try { bse.classList.remove('hidden'); } catch(_) {}
        }
      } catch(_) {}
    } catch(_) {}
  }
  window.__eaglerliteReportError = _report;
  function safeGet(key, def) {
    try {
      var v = localStorage.getItem(key);
      if (v === null) return def;
      return v;
    } catch(_) {}
    try { if (_mem && _mem.has(key)) return _mem.get(key); } catch(_) {}
    return def;
  }
  function safeSet(key, val) {
    try { localStorage.setItem(key, val); return; } catch(_) {}
    try { if (_mem) _mem.set(key, val); } catch(_) {}
  }
  function safeRemove(key) {
    try { localStorage.removeItem(key); } catch(_) {}
    try { if (_mem) _mem.delete(key); } catch(_) {}
  }
  window.__eaglerliteSafeGet = safeGet;
  window.__eaglerliteSafeSet = safeSet;
  window.__eaglerliteSafeRemove = safeRemove;
  function _onReady(fn) {
    try {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { try { fn(); } catch(e) { _report(e, 'onReady'); } });
      } else {
        setTimeout(function() { try { fn(); } catch(e) { _report(e, 'onReady'); } }, 0);
      }
    } catch(e) { _report(e, 'onReady'); }
  }
  window.__eaglerliteOnReady = _onReady;
  function _bindClick(id, handler) {
    try {
      var el = document.getElementById(id);
      if (!el) return false;
      el.addEventListener('click', function(e) {
        try { handler(e); }
        catch(err) { _report(err, 'click:' + id); }
      });
      return true;
    } catch(bindErr) { _report(bindErr, 'bindClick:' + id); return false; }
  }
  window.__eaglerliteBindClick = _bindClick;
  function _bindEvent(id, type, handler, opts) {
    try {
      var el = document.getElementById(id);
      if (!el) return false;
      el.addEventListener(type, function(e) {
        try { handler(e); }
        catch(err) { _report(err, type + ':' + id); }
      }, opts || false);
      return true;
    } catch(bindErr) { _report(bindErr, 'bindEvent:' + id + ':' + type); return false; }
  }
  window.__eaglerliteBindEvent = _bindEvent;
  function _safeGetById(id) {
    try { return document.getElementById(id); } catch(_) { return null; }
  }
  window.__eaglerliteGetById = _safeGetById;
  try {
    window.addEventListener('error', function(e) {
      try {
        var msg = '';
        if (e && e.message) msg = e.message;
        else if (e && e.error && e.error.message) msg = e.error.message;
        else if (e && e.target && e.target.src) msg = 'Failed resource: ' + e.target.src;
        else if (e && e.filename) msg = (e.filename || '') + ':' + (e.lineno || 0) + ':' + (e.colno || 0);
        if (msg) _report(new Error(msg), 'window.onerror');
      } catch(_) {}
    }, true);
    window.addEventListener('unhandledrejection', function(e) {
      try {
        var reason = e && e.reason;
        var msg = '';
        if (reason && reason.message) msg = reason.message;
        else if (reason) msg = String(reason);
        if (msg) _report(new Error(msg), 'unhandledrejection');
      } catch(_) {}
    }, true);
  } catch(_) {}
  try {
    var testKey = '__eaglerlite_csp_test_' + Date.now();
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    _csp.localStorage = 'ok';
  } catch(_) {
    _csp.localStorage = 'blocked';
    _report(new Error('localStorage blocked - using in-memory fallback'), 'csp.localStorage');
  }
  try {
    var launcherSrc = null;
    try {
      if (typeof document !== 'undefined' && document.currentScript && document.currentScript.src) {
        launcherSrc = document.currentScript.src;
      }
    } catch(_) {}
    if (!launcherSrc) {
      try {
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
          if (scripts[i].src && scripts[i].src.indexOf('eaglerlite-ka-launcher') !== -1) {
            launcherSrc = scripts[i].src;
            break;
          }
        }
      } catch(_) {}
    }
    window.__eaglerliteCDN = launcherSrc || 'unknown';
    _csp.cdn = launcherSrc || 'unknown';
  } catch(_) { window.__eaglerliteCDN = 'unknown'; _csp.cdn = 'unknown'; }
  function _hideBootstrapLoader() {
    try {
      var loader = document.getElementById('bootstrapLoader');
      if (loader) loader.style.display = 'none';
      var err = document.getElementById('bootstrapError');
      if (err && !_errs.length) {
        try { err.textContent = ''; } catch(_) {}
        try { err.classList.add('hidden'); } catch(_) {}
      }
      var pasteArea = document.getElementById('manualPasteArea');
      if (pasteArea && !_errs.length) {
        try { pasteArea.style.display = 'none'; } catch(_) {}
      }
    } catch(_) {}
  }
  window.__eaglerliteHideBootstrap = _hideBootstrapLoader;
  try { _hideBootstrapLoader(); } catch(_) {}
  _onReady(_hideBootstrapLoader);
  function _copyErrors() {
    try {
      var json = JSON.stringify(_errs, null, 2);
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(json).then(function() {
            _toast('Error report copied (' + _errs.length + ' entries)', 'ok');
          }).catch(function() { _copyErrorsFallback(json); });
          return;
        }
      } catch(_) {}
      _copyErrorsFallback(json);
    } catch(e) { _toast('Copy failed: ' + e.message, 'err'); }
  }
  function _copyErrorsFallback(json) {
    try {
      var ta = document.createElement('textarea');
      ta.value = json;
      ta.style.position = 'fixed';
      ta.style.top = '-1000px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch(_) { ok = false; }
      document.body.removeChild(ta);
      if (ok) _toast('Error report copied (' + _errs.length + ' entries)', 'ok');
      else _toast('Copy failed', 'err');
    } catch(e) { _toast('Copy fallback failed: ' + e.message, 'err'); }
  }
  window.__eaglerliteCopyErrors = _copyErrors;
  _onReady(function() {
    try {
      var btn = document.getElementById('copyErrorsBtn');
      if (!btn) {
        var anchor = document.getElementById('copyAutolaunchBtn') || document.getElementById('exportCfgBtn');
        if (anchor && anchor.parentNode) {
          btn = document.createElement('button');
          btn.id = 'copyErrorsBtn';
          btn.className = 'cfg-btn';
          btn.type = 'button';
          btn.textContent = 'Copy Errors';
          try { anchor.parentNode.insertBefore(btn, anchor.nextSibling); } catch(_) {}
        }
      }
      if (btn) {
        btn.addEventListener('click', function(e) {
          try { if (e && e.preventDefault) e.preventDefault(); } catch(_) {}
          _copyErrors();
        });
      }
    } catch(_) {}
  });
})();

function setStatus(msg, cls) {
  var el = document.getElementById('status');
  if (!el) return;
  el.textContent = msg;
  el.className = cls || '';
  pushTimeline(msg, cls);
}
function setProgress(v) {
  var el = document.getElementById('prog-fill');
  if (!el) return;
  el.style.width = Math.round(Math.max(0, Math.min(1, v)) * 100) + '%';
}
function setBusy(on) {
  var btn = document.getElementById('launchBtn');
  if (!btn) return;
  btn.disabled = on;
  btn.textContent = on ? 'Loading…' : 'Launch Game';
}

var ACTIVITY_KEY = 'eaglerLiteActivity_v2';
function loadActivity() {
  try { return JSON.parse(safeGet(ACTIVITY_KEY, '[]') || '[]'); }
  catch(_) { return []; }
}
function saveActivity(arr) {
  try { safeSet(ACTIVITY_KEY, JSON.stringify(arr.slice(-50))); }
  catch(_) {}
}
function logActivity(msg, kind) {
  var entry = { t: Date.now(), msg: String(msg).slice(0,200), kind: kind || 'info' };
  var arr = loadActivity();
  arr.push(entry);
  saveActivity(arr);
}
function pushTimeline(msg, cls) {
  var tl = document.getElementById('timeline');
  if (!tl) return;
  var empty = tl.querySelector('.timeline-empty');
  if (empty) empty.remove();
  var time = new Date().toLocaleTimeString();
  var entry = document.createElement('div');
  entry.className = 'timeline-entry';
  var cls2 = cls || '';
  entry.innerHTML = '<span class="timeline-time">' + escapeHtml(time) + '</span>' +
                    '<span class="timeline-msg ' + cls2 + '">' + escapeHtml(msg) + '</span>';
  tl.insertBefore(entry, tl.firstChild);
  while (tl.children.length > 5) tl.removeChild(tl.lastChild);
}
function escapeHtml(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
                 .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function renderTimeline() {
  var tl = document.getElementById('timeline');
  if (!tl) return;
  var arr = loadActivity();
  if (!arr.length) {
    tl.innerHTML = '<div class="timeline-empty">No activity yet &mdash; launch the game to populate.</div>';
    return;
  }
  tl.innerHTML = '';
  var recent = arr.slice(-5).reverse();
  for (var i = 0; i < recent.length; i++) {
    var e = recent[i];
    var time = new Date(e.t).toLocaleTimeString();
    var entry = document.createElement('div');
    entry.className = 'timeline-entry';
    entry.innerHTML = '<span class="timeline-time">' + escapeHtml(time) + '</span>' +
                      '<span class="timeline-msg ' + (e.kind||'') + '">' + escapeHtml(e.msg) + '</span>';
    tl.appendChild(entry);
  }
}

function downloadLauncher() {
  setBusy(true); setProgress(0); setStatus('Building standalone launcher...', 'load');
  try {
    var inputs = document.querySelectorAll('input[type="text"], input[type="checkbox"]');
    for (var i = 0; i < inputs.length; i++) {
      var inp = inputs[i];
      if (inp.type === 'checkbox') {
        if (inp.checked) inp.setAttribute('checked', 'checked');
        else inp.removeAttribute('checked');
      } else {
        inp.setAttribute('value', inp.value);
      }
    }
    var sel = document.getElementById('gameVersion');
    if (sel) {
      var opt = sel.querySelector('option[selected]');
      if (opt) opt.removeAttribute('selected');
      var curOpt = sel.options[sel.selectedIndex];
      if (curOpt) curOpt.setAttribute('selected', 'selected');
    }
    var detailsEls = document.querySelectorAll('details');
    for (var d = 0; d < detailsEls.length; d++) {
      if (detailsEls[d].open) detailsEls[d].setAttribute('open', 'open');
      else detailsEls[d].removeAttribute('open');
    }
    var launcherComment = '';
    try {
      for (var node = document.firstChild; node; node = node.nextSibling) {
        if (node.nodeType === 8) { launcherComment = '\n'; break; }
        if (node.nodeType === 1) break;
      }
    } catch(_) {}
    var cloneRoot = document.documentElement.cloneNode(true);
    
    var cStatus = cloneRoot.querySelector('#status');
    if (cStatus) { cStatus.textContent = 'Ready \u2014 configure below and click Launch'; cStatus.className = ''; }
    var cProg = cloneRoot.querySelector('#prog-fill');
    if (cProg) cProg.style.width = '0%';
    var cBtn = cloneRoot.querySelector('#launchBtn');
    if (cBtn) { cBtn.disabled = false; cBtn.textContent = 'Launch Game'; }
    var cTl = cloneRoot.querySelector('#timeline');
    if (cTl) cTl.innerHTML = '<div class="timeline-empty">No activity yet.</div>';
    var cEmbedBar = cloneRoot.querySelector('#embedCloseBar');
    if (cEmbedBar) cEmbedBar.className = 'hidden';
    var cGameFrame = cloneRoot.querySelector('#kaGameFrame');
    if (cGameFrame) { try { cGameFrame.removeAttribute('srcdoc'); } catch(_) {} try { if (cGameFrame.parentNode) cGameFrame.parentNode.removeChild(cGameFrame); } catch(_) {} }
    var cModal = cloneRoot.querySelector('#resetModal');
    if (cModal) cModal.className = 'modal-overlay hidden';
    var fullHTML = launcherComment + '<!DOCTYPE html>\n' + cloneRoot.outerHTML;
    var blob = new Blob([fullHTML], { type: 'text/html;charset=utf-8' });
    var blobUrl = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'EaglerLite.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    setTimeout(function() { URL.revokeObjectURL(blobUrl); }, 100);
    setStatus('\u2713 Downloaded EaglerLite.html \u2014 open the file, then click Launch Game (pointer lock will work).', 'ok');
    setProgress(1);
    logActivity('Downloaded standalone launcher', 'ok');
  } catch(e) {
    setStatus('Failed to build launcher: ' + e.message, 'err');
    logActivity('Download failed: ' + e.message, 'err');
    try { console.error('[EaglerLite] downloadLauncher error:', e); } catch(_) {}
  } finally {
    setBusy(false);
  }
}

function detectSandbox() {
  try {
    if (window.self === window.top) return false;
    var frame = null;
    try { frame = window.frameElement; } catch(_) { return true; }
    if (!frame) return true;
    var sandbox = frame.getAttribute('sandbox');
    if (sandbox === null) return false;
    if (sandbox === '') return true;
    return sandbox.indexOf('allow-pointer-lock') === -1 ||
           sandbox.indexOf('allow-popups-to-escape-sandbox') === -1 ||
           sandbox.indexOf('allow-same-origin') === -1;
  } catch(e) { return true; }
}

var CLIENT_CHUNK_URLS = [
  'https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-client-a.js?v=2.1.0',
  'https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-client-b.js?v=2.1.0'
];

var GAME_SHIM = "(function(){\ntry {\nvar _origFetch=(typeof window.fetch===\"function\")?window.fetch.bind(window):null;\nfunction _dataUriBytes(url){\n  var ci=url.indexOf(\",\");\n  if(ci===-1)throw new Error(\"malformed data URI\");\n  var meta=url.slice(0,ci);\n  var payload=url.slice(ci+1);\n  var bytes;\n  if(meta.indexOf(\"base64\")!==-1){\n    var bin=window.atob(payload);\n    bytes=new Uint8Array(bin.length);\n    for(var i=0;i<bin.length;i++)bytes[i]=bin.charCodeAt(i);\n  }else{\n    var dec=window.decodeURIComponent(payload);\n    bytes=new Uint8Array(dec.length);\n    for(var j=0;j<dec.length;j++)bytes[j]=dec.charCodeAt(j)&255;\n  }\n  return bytes;\n}\nwindow.__eagDataUriBytes=_dataUriBytes;\nwindow.fetch=function(input,init){\n  var url=null;\n  try{\n    if(typeof input===\"string\")url=input;\n    else if(input&&typeof input.url===\"string\")url=input.url;\n  }catch(_){}\n  if(url&&url.slice(0,5)===\"data:\"){\n    return new Promise(function(resolve,reject){\n      try{\n        var bytes=_dataUriBytes(url);\n        var ci=url.indexOf(\";\");\n        var mime=(ci>5)?url.slice(5,ci):\"application/octet-stream\";\n        if(typeof Response===\"function\")resolve(new Response(bytes.buffer,{status:200,statusText:\"OK\",headers:{\"content-type\":mime}}));\n        else resolve({ok:true,status:200,arrayBuffer:function(){return Promise.resolve(bytes.buffer);}});\n      }catch(e){reject(e);}\n    });\n  }\n  if(url&&url.slice(0,5)===\"blob:\"){\n    var bl=null;\n    try{bl=(window.__eagBlobMap||{})[url];}catch(_){}\n    if(bl){\n      return new Promise(function(resolve,reject){\n        try{\n          var rd=new FileReader();\n          rd.onloadend=function(){\n            try{\n              if(typeof Response===\"function\")resolve(new Response(rd.result,{status:200,statusText:\"OK\"}));\n              else resolve({ok:true,status:200,arrayBuffer:function(){return Promise.resolve(rd.result);}});\n            }catch(e){reject(e);}\n          };\n          rd.onerror=function(){reject(new Error(\"blob read error\"));};\n          rd.readAsArrayBuffer(bl);\n        }catch(e){reject(e);}\n      });\n    }\n  }\n  if(!_origFetch)return Promise.reject(new Error(\"fetch unavailable\"));\n  return _origFetch(input,init);\n};\nvar _origCOU=(typeof URL!==\"undefined\"&&URL.createObjectURL)?URL.createObjectURL:null;\nif(_origCOU){\n  window.__eagBlobMap={};\n  URL.createObjectURL=function(blob){\n    var u=_origCOU.call(URL,blob);\n    try{window.__eagBlobMap[u]=blob;}catch(_){}\n    return u;\n  };\n}\nvar _origROU=(typeof URL!==\"undefined\"&&URL.revokeObjectURL)?URL.revokeObjectURL:null;\nif(_origROU){\n  URL.revokeObjectURL=function(u){\n    try{if(window.__eagBlobMap)delete window.__eagBlobMap[u];}catch(_){}\n    return _origROU.call(URL,u);\n  };\n}\nvar _origOpen=XMLHttpRequest.prototype.open;\nvar _origSend=XMLHttpRequest.prototype.send;\nXMLHttpRequest.prototype.open=function(method,url){\n  try{this.__eagReqUrl=String(url);}catch(_){}\n  return _origOpen.apply(this,arguments);\n};\nXMLHttpRequest.prototype.send=function(){\n  var u=null;\n  try{u=this.__eagReqUrl;}catch(_){}\n  if(u&&u.slice(0,5)===\"data:\"){\n    var self=this;\n    setTimeout(function(){\n      try{\n        var bytes=_dataUriBytes(u);\n        try{Object.defineProperty(self,\"response\",{value:bytes.buffer,configurable:true});}catch(_){}\n        try{Object.defineProperty(self,\"responseText\",{value:\"\",configurable:true});}catch(_){}\n        try{Object.defineProperty(self,\"status\",{value:200,configurable:true});}catch(_){}\n        self.dispatchEvent(new Event(\"load\"));\n      }catch(e){try{self.dispatchEvent(new Event(\"error\"));}catch(_){}}\n    },0);\n    return;\n  }\n  if(u&&u.slice(0,5)===\"blob:\"){\n    var self2=this;\n    var bl2=null;\n    try{bl2=(window.__eagBlobMap||{})[u];}catch(_){}\n    if(bl2){\n      try{\n        var rd=new FileReader();\n        rd.addEventListener(\"loadend\",function(){\n          try{\n            var res=rd.result;\n            try{Object.defineProperty(self2,\"response\",{value:res,configurable:true});}catch(_){}\n            try{Object.defineProperty(self2,\"status\",{value:200,configurable:true});}catch(_){}\n            self2.dispatchEvent(new Event(\"load\"));\n          }catch(e){try{self2.dispatchEvent(new Event(\"error\"));}catch(_){}}\n        });\n        rd.addEventListener(\"error\",function(){try{self2.dispatchEvent(new Event(\"error\"));}catch(_){}});\n        rd.readAsArrayBuffer(bl2);\n        return;\n      }catch(_){setTimeout(function(){try{self2.dispatchEvent(new Event(\"error\"));}catch(_){}},0);return;}\n    }\n    setTimeout(function(){try{self2.dispatchEvent(new Event(\"error\"));}catch(_){}},0);\n    return;\n  }\n  return _origSend.apply(this,arguments);\n};\nvar _origSetAttr=Element.prototype.setAttribute;\nElement.prototype.setAttribute=function(name,value){\n  try{\n    if((name===\"src\"||name===\"href\")&&typeof value===\"string\"&&value.slice(0,11)===\"data:image/\"){\n      return;\n    }\n  }catch(_){}\n  return _origSetAttr.apply(this,arguments);\n};\ntry{\n  var _linkDesc=Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype,\"href\");\n  if(_linkDesc&&_linkDesc.get&&_linkDesc.set){\n    Object.defineProperty(HTMLLinkElement.prototype,\"href\",{\n      get:function(){return _linkDesc.get.call(this);},\n      set:function(v){if(typeof v===\"string\"&&v.slice(0,11)===\"data:image/\")return;_linkDesc.set.call(this,v);}\n    });\n  }\n}catch(_){}\ntry{\n  var _imgDesc=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,\"src\");\n  if(_imgDesc&&_imgDesc.get&&_imgDesc.set){\n    Object.defineProperty(HTMLImageElement.prototype,\"src\",{\n      get:function(){return _imgDesc.get.call(this);},\n      set:function(v){if(typeof v===\"string\"&&v.slice(0,11)===\"data:image/\")return;_imgDesc.set.call(this,v);}\n    });\n  }\n}catch(_){}\nfunction _canvasImgLoad(cv,url){\n  try{\n    var blob=null;\n    if(url.slice(0,5)===\"blob:\"){\n      try{blob=(window.__eagBlobMap||{})[url];}catch(_){}\n    }else if(url.slice(0,11)===\"data:image/\"){\n      var bytes=_dataUriBytes(url);\n      var ci2=url.indexOf(\",\");\n      var meta=url.slice(0,ci2);\n      var semi=meta.indexOf(\";\");\n      var mime=semi>5?meta.slice(5,semi):\"image/png\";\n      blob=new Blob([bytes],{type:mime});\n    }\n    if(!blob){setTimeout(function(){try{cv.dispatchEvent(new Event(\"error\"));}catch(_){}},0);return;}\n    var done=false;\n    var fail=function(){if(done)return;done=true;try{cv.dispatchEvent(new Event(\"error\"));}catch(_){}};\n    var ok=function(bitmap){\n      if(done)return;done=true;\n      try{\n        cv.width=bitmap.width;cv.height=bitmap.height;\n        try{Object.defineProperty(cv,\"naturalWidth\",{value:bitmap.width,configurable:true});}catch(_){}\n        try{Object.defineProperty(cv,\"naturalHeight\",{value:bitmap.height,configurable:true});}catch(_){}\n        try{Object.defineProperty(cv,\"complete\",{value:true,configurable:true});}catch(_){}\n        var ctx=cv.getContext(\"2d\");\n        ctx.drawImage(bitmap,0,0);\n        cv.dispatchEvent(new Event(\"load\"));\n      }catch(e){fail();}\n    };\n    if(typeof window.createImageBitmap===\"function\"){\n      window.createImageBitmap(blob).then(ok,fail);\n    }else{\n      var turl=_origCOU?_origCOU.call(URL,blob):null;\n      var im=(_origCreate2?_origCreate2(\"img\"):null);\n      if(turl&&im){\n        im.onload=function(){try{cv.width=im.naturalWidth;cv.height=im.naturalHeight;var c2=cv.getContext(\"2d\");c2.drawImage(im,0,0);cv.dispatchEvent(new Event(\"load\"));}catch(e){fail();}};\n        im.onerror=fail;\n        im.src=turl;\n      }else{fail();}\n    }\n  }catch(e){try{cv.dispatchEvent(new Event(\"error\"));}catch(_){}}\n}\nvar _origCreate2=null;\ntry{_origCreate2=document.createElement.bind(document);}catch(_){}\nif(_origCreate2){\n  document.createElement=function(tag){\n    if(String(tag).toLowerCase()===\"img\"){\n      var cv=_origCreate2(\"canvas\");\n      try{cv.width=0;cv.height=0;}catch(_){}\n      try{\n        Object.defineProperty(cv,\"src\",{\n          configurable:true,\n          get:function(){return cv.__eagImgSrc||\"\";},\n          set:function(v){cv.__eagImgSrc=String(v);_canvasImgLoad(cv,String(v));}\n        });\n      }catch(_){}\n      return cv;\n    }\n    return _origCreate2(tag);\n  };\n}\n}catch(_shimErr){}\n})();\n";
function buildKASrcdoc(cfg, opts) {
  opts = opts || {};
  var stripReferrer = opts.stripReferrer !== false;
  var refMeta = stripReferrer ? '<meta name="referrer" content="no-referrer">\n' : '';
  var cfgJson = JSON.stringify(cfg).replace(/<\/script/gi, '<\\/script');
  if (opts.fallback) {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Launch failed</title></head>' +
      '<body style="background:#000;color:#eee;font:14px monospace;padding:24px">' +
      '<h2>EaglerLite launch failed</h2>' +
      '<p>Check the launcher toast or error report for details.</p>' +
      '<p>If the client chunks are not reachable on the CDN, use the manual paste fallback with the raw Eaglercraft_1.12.js client source.</p>' +
      '</body></html>';
  }
  var pasted = (typeof opts.pastedClient === 'string' && opts.pastedClient.length > 0) ? opts.pastedClient : null;
  var chunkList = '["' + CLIENT_CHUNK_URLS.join('","') + '"]';
  var boot = [];
  boot.push('(function(){\n');
  boot.push('var __done=false,__failed=false;\n');
  boot.push('function __post(m){try{if(window.parent&&typeof window.parent.postMessage==="function"){window.parent.postMessage(m,"*");}}catch(_){}}\n');
  boot.push('window.__eagFireReady=function(){if(__done)return;__done=true;__post({type:"eaglerlite-ready",gameVersion:"1.12.2",source:"ka-chunks"});};\n');
  boot.push('window.__eagFail=function(r){if(__failed||__done)return;__failed=true;__post({type:"eaglerlite-fail",reason:String(r||"unknown failure"),gameVersion:"1.12.2",source:"ka-chunks"});};\n');
  boot.push('function toast(m,k){var s=document.getElementById("toastStack");if(!s)return;var t=document.createElement("div");t.className="toast-item "+(k||"");t.textContent=String(m);s.appendChild(t);try{requestAnimationFrame(function(){t.classList.add("show")});}catch(_){t.classList.add("show");}setTimeout(function(){t.classList.remove("show");setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},300)},k==="err"?6000:3000)}\n');
  boot.push('window.__eagToast=toast;\n');
  boot.push(GAME_SHIM);
  boot.push("(function() {\n  try {\n    var __grabbed = false;\n    function __grabFocus(force) {\n      try {\n        if (__grabbed && !force) return;\n        try { window.focus(); } catch (_) {}\n        try {\n          if (window.__eagKeyCap && typeof window.__eagKeyCap.focus === 'function') window.__eagKeyCap.focus();\n          __grabbed = true;\n        } catch (_) {}\n      } catch (_) {}\n    }\n    try {\n      document.addEventListener('mousedown', function() { __grabbed = false; __grabFocus(false); }, true);\n      document.addEventListener('touchstart', function() { __grabbed = false; __grabFocus(false); }, true);\n      document.addEventListener('pointerlockchange', function() { __grabFocus(true); }, true);\n    } catch (_) {}\n    function __ensureCaptureInput() {\n      try {\n        if (!window.__eagKeyCap) {\n          var inp = document.createElement('input');\n          inp.type = 'text';\n          inp.autocomplete = 'off';\n          inp.setAttribute('autocapitalize', 'off');\n          inp.setAttribute('spellcheck', 'false');\n          inp.setAttribute('style', 'position:fixed;left:0;top:0;width:2px;height:2px;opacity:0.0001;z-index:-1;border:0;padding:0;margin:0;background:transparent;color:transparent;outline:none;box-shadow:none;pointer-events:none;caret-color:transparent;font-size:1px;');\n          try {\n            inp.addEventListener('input', function() { try { inp.value = ''; } catch (_) {} }, true);\n          } catch (_) {}\n          try { (document.body || document.documentElement).appendChild(inp); } catch (_) {}\n          window.__eagKeyCap = inp;\n        }\n        __grabFocus(true);\n      } catch (_) {}\n    }\n    var __cvDone = false;\n    function __hookCanvas(c) {\n      if (__cvDone || !c) return;\n      __cvDone = true;\n      try { c.tabIndex = 0; } catch (_) {}\n      try {\n        c.addEventListener('mousedown', function() { __grabbed = false; __ensureCaptureInput(); }, true);\n        c.addEventListener('touchstart', function() { __grabbed = false; __ensureCaptureInput(); }, true);\n      } catch (_) {}\n    }\n    var __cvTries = 0;\n    var __cvWatch = setInterval(function() {\n      __cvTries++;\n      try {\n        var c = null;\n        try { c = document.querySelector('#game_frame canvas'); } catch (_) {}\n        if (!c) { try { c = document.querySelector('canvas'); } catch (_) {} }\n        if (c && c.width > 0) { __hookCanvas(c); clearInterval(__cvWatch); return; }\n      } catch (_) {}\n      if (__cvTries > 900) { try { clearInterval(__cvWatch); } catch (_) {} }\n    }, 400);\n    try { window.addEventListener('load', function() { setTimeout(__ensureCaptureInput, 400); }); } catch (_) {}\n  } catch (_kbErr) {}\n})();\n");

  boot.push('function loadScript(urls,idx,onDone,onAllFailed){if(idx>=urls.length){onAllFailed();return;}var s=document.createElement("script");s.src=urls[idx];s.async=false;try{s.className="eag112-chunk";}catch(_){}s.onload=function(){if(idx+1<urls.length){loadScript(urls,idx+1,onDone,onAllFailed);}else{onDone(idx,urls.length);}};s.onerror=function(){toast("Failed to load chunk "+(idx+1)+": "+urls[idx],"err");try{if(s.parentNode)s.parentNode.removeChild(s);}catch(_){}loadScript(urls,idx+1,onDone,onAllFailed);};document.head.appendChild(s);}\n');
  boot.push('window.__eagExecuteClient=function(){try{var S=window.__eag112Src||"";window.__eag112Src=null;if(!S){window.__eagFail("client source unavailable before execution");return;}var sc=document.createElement("script");sc.textContent=S;document.head.appendChild(sc);try{var __cs=document.querySelectorAll("script.eag112-chunk");for(var __ci=0;__ci<__cs.length;__ci++){try{if(__cs[__ci].parentNode)__cs[__ci].parentNode.removeChild(__cs[__ci]);}catch(_){}}}catch(_){}}catch(e){window.__eagFail("client execute error: "+((e&&e.message)||e));}};\n');
  boot.push('try{\n');
  boot.push('window.eaglercraftXOpts={container:"game_frame",worldsDB:"worlds",singleThreadMode:true,relays:[],servers:[],hooks:{screenChanged:function(){try{window.__eagFireReady();}catch(_){}}}};\n');
  boot.push('window.eaglerLiteCfg=' + cfgJson + ';\n');
  boot.push('var __tries=0;\n');
  boot.push('function __poll(){if(__done||__failed)return;var c=null;try{c=document.querySelector("#game_frame canvas");}catch(_){}if(c&&c.width>0){window.__eagFireReady();return;}__tries++;if(__tries>=300){window.__eagFail("client canvas never appeared after 150s of polling");return;}setTimeout(__poll,500);}\n');
  boot.push('setTimeout(__poll,500);\n');
  if (!pasted) {
    boot.push('var CHUNK_URLS=' + chunkList + ';\n');
    boot.push('var __hook=null;try{__hook=window.parent.__eag112TestChunks;}catch(_){__hook=null;}\n');
    boot.push('var __hookOk=false;\n');
    boot.push('if(__hook&&typeof __hook.length==="number"&&__hook.length>=1){__hookOk=true;for(var __hi=0;__hi<__hook.length;__hi++){if(typeof __hook[__hi]!=="string"){__hookOk=false;break;}}}\n');
    boot.push('if(__hookOk){try{window.__eag112Src=__hook.join("");window.__eagExecuteClient();}catch(e){window.__eagFail("client execute error: "+((e&&e.message)||e));}}\n');
    boot.push('else{try{loadScript(CHUNK_URLS,0,function(idx,total){if(idx+1>=total){try{if(!window.__eag112Src){window.__eagFail("client chunks loaded but source is empty");return;}window.__eagExecuteClient();}catch(e){window.__eagFail("client execute error: "+((e&&e.message)||e));}}},function(){window.__eagFail("client chunk files not reachable on CDN (not pushed yet or network blocked)");});}catch(e){window.__eagFail("chunk loader error: "+((e&&e.message)||e));}}\n');
  }
  boot.push('}catch(bootErr){window.__eagFail("boot error: "+((bootErr&&bootErr.message)||bootErr));}\n');
  boot.push('})();\n');
  var parts = [];
  parts.push('<!DOCTYPE html>\n');
  parts.push('<html>\n<head>\n');
  parts.push('<meta charset="UTF-8">\n');
  parts.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">\n');
  parts.push(refMeta);
  parts.push('<style>html,body{margin:0;padding:0;width:100vw;height:100vh;overflow:hidden;background:#000}#toastStack{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);z-index:100000001;display:flex;flex-direction:column-reverse;gap:4px;pointer-events:none;max-width:90vw}.toast-item{background:#222;color:#eee;padding:6px 12px;border-radius:6px;font:13px monospace;opacity:0;transition:opacity .2s;max-width:90vw}.toast-item.show{opacity:1}.toast-item.err{background:#400;border:1px solid #f55}.toast-item.ok{background:#040;border:1px solid #5f5}</style>\n');
  parts.push('<title>Spin-off of "Eaglercraft Singleplayer Test"</title>\n');
  parts.push('</head>\n');
  parts.push('<body id="game_frame">\n');
  parts.push('<div id="toastStack"></div>\n');
  parts.push('<scr' + 'ipt>\n');
  parts.push(boot.join(''));
  parts.push('</scr' + 'ipt>\n');
  if (opts.optimizerCode) {
    parts.push('<scr' + 'ipt>\n');
    parts.push(opts.optimizerCode + '\n');
    parts.push('</scr' + 'ipt>\n');
  }
  if (pasted) {
    var carried = JSON.stringify(pasted).replace(/<\/script/gi, '<\\/script');
    parts.push('<scr' + 'ipt>\n');
    parts.push('window.__eag112Src=' + carried + ';\n');
    parts.push('try{window.__eagExecuteClient();}catch(e){try{window.__eagFail("client execute error: "+((e&&e.message)||e));}catch(_){}}\n');
    parts.push('</scr' + 'ipt>\n');
  }
  parts.push('</body>\n</html>\n');
  return parts.join('');
}

var _launching = false;
var _launchTimeout = null;
function _setLaunchState(state, msg, cls) {
  try { setStatus(msg || state, cls); } catch(_) {}
}
function _validateLaunchConfig(cfg) {
  var warnings = [];
  try {
    if (cfg.panicLink) {
      if (!/^https?:\/\//i.test(cfg.panicLink) && cfg.panicLink.indexOf('about:') !== 0) {
        warnings.push('Panic link should be a valid URL (http/https/about)');
      }
    }
    if (cfg.sprintKey) {
      var knownCodes = ['ControlLeft','ControlRight','ShiftLeft','ShiftRight','AltLeft','AltRight','Space','Enter','Tab','Backspace','Escape'];
      if (!(/^Key[A-Z]$/.test(cfg.sprintKey) || /^Digit[0-9]$/.test(cfg.sprintKey) || knownCodes.indexOf(cfg.sprintKey) !== -1)) {
        warnings.push('Sprint key may not be a valid KeyboardEvent.code: ' + cfg.sprintKey);
      }
    }
    if (cfg.maxFPS) {
      var n = parseInt(cfg.maxFPS, 10);
      if (isNaN(n) || n <= 0 || n > 1000) warnings.push('maxFPS must be a positive number <= 1000');
    }
  } catch(_) {}
  return warnings;
}
function _revealManualPaste() {
  try {
    var box = document.getElementById('manualPasteBox');
    if (!box) box = document.getElementById('manualPasteArea');
    if (!box) {
      try { window.__eaglerliteToast('Manual paste box unavailable - reload the launcher page', 'err'); } catch(_) {}
      return;
    }
    try { box.style.display = 'block'; } catch(_) {}
    try { box.classList.add('show'); } catch(_) {}
    try { window.__eaglerliteToast('Client chunks unreachable - paste the raw Eaglercraft_1.12.js client source below as offline fallback', 'err'); } catch(_) {}
  } catch(_) {}
}

function cleanup() {
  try { if (_launchTimeout) { clearTimeout(_launchTimeout); _launchTimeout = null; } } catch(_) {}
  try {
    var f = document.getElementById('kaGameFrame');
    if (f) { try { f.srcdoc = ''; } catch(_) {} try { f.remove(); } catch(_) {} }
  } catch(_) {}
  try {
    var b = document.getElementById('embedCloseBar');
    if (b) b.className = 'hidden';
  } catch(_) {}
  try { document.body.style.overflow = ''; } catch(_) {}
  try { setBusy(false); } catch(_) {}
  _launching = false;
}
window.__eaglerliteCleanup = cleanup;

var _readyListener = null;

var _keyRelayInstalled = false;
function _installKeyRelay() {
  if (_keyRelayInstalled) return;
  _keyRelayInstalled = true;
  function _relay(type) {
    return function(e) {
      try {
        var f = document.getElementById('kaGameFrame');
        if (!f || !f.contentDocument) return;
        var t = e.target;
        if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
        if (e.__eagRelayed) return;
        var fd = f.contentDocument;
        try { if (fd.hasFocus()) return; } catch(_) {}
        var KE = f.contentWindow && f.contentWindow.KeyboardEvent;
        if (!KE) KE = window.KeyboardEvent;
        if (!KE) return;
        var init = {};
        try { init.key = e.key; } catch(_) {}
        try { init.code = e.code; } catch(_) {}
        try { init.keyCode = e.keyCode; } catch(_) {}
        try { init.charCode = e.charCode; } catch(_) {}
        try { init.ctrlKey = e.ctrlKey; } catch(_) {}
        try { init.shiftKey = e.shiftKey; } catch(_) {}
        try { init.altKey = e.altKey; } catch(_) {}
        try { init.metaKey = e.metaKey; } catch(_) {}
        try { init.location = e.location; } catch(_) {}
        try { init.repeat = e.repeat; } catch(_) {}
        init.bubbles = true;
        init.cancelable = true;
        var ev = new KE(type, init);
        try { ev.__eagRelayed = true; } catch(_) {}
        fd.documentElement.dispatchEvent(ev);
        if (e.cancelable) { try { e.preventDefault(); } catch(_) {} }
      } catch (_) {}
    };
  }
  try {
    document.addEventListener('keydown', _relay('keydown'), true);
    document.addEventListener('keyup', _relay('keyup'), true);
    document.addEventListener('keypress', _relay('keypress'), true);
  } catch (_) {}
}

function _ensureReadyListener() {
  if (_readyListener) return;
  _readyListener = function(ev) {
    try {
      var data = ev && ev.data;
      if (!data || typeof data !== 'object') return;
      if (data.type !== 'eaglerlite-ready' && data.type !== 'eaglerlite-fail') return;
      if (data.type === 'eaglerlite-ready') {
        if (_launchTimeout) { try { clearTimeout(_launchTimeout); } catch(_) {} _launchTimeout = null; }
        _launching = false;
        try { setBusy(false); } catch(_) {}
        try { _setLaunchState('launched', 'Launched 1.12.2!', 'ok'); } catch(_) {}
        try { setProgress(1); } catch(_) {}
        try { logActivity('Eaglercraft 1.12.2 runtime ready (chunks)', 'ok'); } catch(_) {}
        try { pushHistory('runtime-ready', 'ok', '1.12.2'); } catch(_) {}
        try { _installKeyRelay(); } catch(_) {}
        try {
          var __rf = document.getElementById('kaGameFrame');
          if (__rf && __rf.contentWindow) __rf.contentWindow.focus();
        } catch(_) {}
      } else if (data.type === 'eaglerlite-fail') {
        if (_launchTimeout) { try { clearTimeout(_launchTimeout); } catch(_) {} _launchTimeout = null; }
        _launching = false;
        try { setBusy(false); } catch(_) {}
        var errMsg = data.reason || 'runtime did not signal readiness';
        try { _setLaunchState('runtime-failed', 'Runtime failed: ' + errMsg + ' - try the manual paste fallback (raw Eaglercraft_1.12.js source)', 'err'); } catch(_) {}
        try { window.__eaglerliteReportError(new Error('Runtime failed: ' + errMsg), 'launchGame.runtimeFailed'); } catch(_) {}
        try { logActivity('Runtime failed: ' + errMsg, 'err'); } catch(_) {}
        try { pushHistory('runtime-failed', 'err', String(errMsg).slice(0, 80)); } catch(_) {}
        try { _revealManualPaste(); } catch(_) {}
      }
    } catch(_) {}
  };
  try { window.addEventListener('message', _readyListener, false); } catch(_) {}
}

function EaglerLiteOptimizer(CFG) {
'use strict';
CFG = CFG || {};
var _trapPropNames = [];
function _cleanupTraps() {
for (var i = 0; i < _trapPropNames.length; i++) {
try { delete Object.prototype[_trapPropNames[i]]; } catch(_) {}
}
_trapPropNames.length = 0;
}
try {
var S = { draws: 0 };
if (CFG.p9) {
var origAudioCtx = window.AudioContext || window.webkitAudioContext;
if (origAudioCtx) {
var WrappedAudioContext = function(opts) {
var finalOpts = {};
if (opts && typeof opts === 'object') {
for (var ak in opts) { if (Object.prototype.hasOwnProperty.call(opts, ak)) finalOpts[ak] = opts[ak]; }
}
finalOpts.latencyHint = 'playback';
var ctx;
try { ctx = new origAudioCtx(finalOpts); } catch(e) { try { ctx = new origAudioCtx(opts); } catch(e2) { ctx = new origAudioCtx(); } }
return ctx;
};
WrappedAudioContext.prototype = origAudioCtx.prototype;
window.AudioContext = WrappedAudioContext;
if (window.webkitAudioContext) window.webkitAudioContext = WrappedAudioContext;
}
}
if (CFG.zoom) {
var gameCanvas = null;
function applyZoom(on) {
if (!gameCanvas || !gameCanvas.isConnected) gameCanvas = document.querySelector('canvas');
if (gameCanvas) {
gameCanvas.style.transform = on ? 'scale(4)' : 'scale(1)';
gameCanvas.style.transformOrigin = 'center center';
gameCanvas.style.transition = 'transform 0.15s ease';
}
}
document.addEventListener('keydown', function(e) { if ((e.code === 'KeyC' || e.key === 'c' || e.key === 'C' || e.keyCode === 67) && document.pointerLockElement) applyZoom(true); });
document.addEventListener('keyup', function(e) { if ((e.code === 'KeyC' || e.key === 'c' || e.key === 'C' || e.keyCode === 67) && document.pointerLockElement) applyZoom(false); });
}
if (CFG.autosprint) {
var sprintState = { code: CFG.sprintKey || 'ControlLeft', keyCode: 17, keyStr: 'Control' };
function keyCodeToCode(kc) {
if (typeof kc !== 'number' || isNaN(kc)) return null;
if (kc >= 65 && kc <= 90) return 'Key' + String.fromCharCode(kc);
if (kc >= 48 && kc <= 57) return 'Digit' + (kc - 48);
if (kc === 17) return 'ControlLeft';
if (kc === 16) return 'ShiftLeft';
if (kc === 18) return 'AltLeft';
if (kc === 32) return 'Space';
if (kc === 13) return 'Enter';
if (kc === 9) return 'Tab';
if (kc === 8) return 'Backspace';
if (kc === 27) return 'Escape';
if (kc === 37) return 'ArrowLeft';
if (kc === 38) return 'ArrowUp';
if (kc === 39) return 'ArrowRight';
if (kc === 40) return 'ArrowDown';
if (kc === 45) return 'Insert';
if (kc === 46) return 'Delete';
if (kc === 36) return 'Home';
if (kc === 35) return 'End';
if (kc === 33) return 'PageUp';
if (kc === 34) return 'PageDown';
if (kc === 20) return 'CapsLock';
if (kc >= 112 && kc <= 135) return 'F' + (kc - 111);
if (kc >= 96 && kc <= 105) return 'Numpad' + (kc - 96);
if (kc === 107) return 'NumpadAdd';
if (kc === 109) return 'NumpadSubtract';
if (kc === 106) return 'NumpadMultiply';
if (kc === 111) return 'NumpadDivide';
if (kc === 110) return 'NumpadDecimal';
return null;
}
function autoDetectSprintKey() {
try {
var lsKeys = Object.keys(localStorage);
for (var i = 0; i < lsKeys.length; i++) {
var key = lsKeys[i];
var val = null;
try { val = localStorage.getItem(key); } catch(_) { continue; }
if (!val || val.length > 2000000) continue;
var m = null;
var kc = null;
if (m = /key_key\.sprint[^\d\-]*(\-?\d+)/.exec(val)) {
kc = parseInt(m[1], 10);
} else if (m = /["']key_key\.sprint["']\s*[:=]\s*(\-?\d+)/.exec(val)) {
kc = parseInt(m[1], 10);
} else if (m = /key\.sprint[^\d\-]*(\-?\d+)/.exec(val)) {
kc = parseInt(m[1], 10);
} else if (m = /["']key\.sprint["']\s*[:=]\s*(\-?\d+)/.exec(val)) {
kc = parseInt(m[1], 10);
}
if (kc !== null) {
var code = keyCodeToCode(kc);
if (code) return code;
}
}
for (var i = 0; i < lsKeys.length; i++) {
var key = lsKeys[i];
if (!key) continue;
var keyLower = key.toLowerCase();
if (keyLower.indexOf('sprint') !== -1) {
var val2 = null;
try { val2 = localStorage.getItem(key); } catch(_) { continue; }
if (!val2) continue;
var kc2 = parseInt(val2.trim(), 10);
if (!isNaN(kc2)) {
var code2 = keyCodeToCode(kc2);
if (code2) return code2;
}
}
}
} catch(_) {}
return null;
}
function resolveSprintKey() {
var code = sprintState.code;
var keyCode = 17, keyStr = 'Control';
if (code === 'ShiftLeft' || code === 'ShiftRight') { keyCode = 16; keyStr = 'Shift'; }
else if (code === 'AltLeft' || code === 'AltRight') { keyCode = 18; keyStr = 'Alt'; }
else if (code === 'ControlLeft' || code === 'ControlRight') { keyCode = 17; keyStr = 'Control'; }
else if (code === 'Space') { keyCode = 32; keyStr = ' '; }
else if (code === 'Enter' || code === 'NumpadEnter') { keyCode = 13; keyStr = 'Enter'; }
else if (code === 'Tab') { keyCode = 9; keyStr = 'Tab'; }
else if (code === 'Backspace') { keyCode = 8; keyStr = 'Backspace'; }
else if (code === 'Escape') { keyCode = 27; keyStr = 'Escape'; }
else if (code === 'ArrowUp') { keyCode = 38; keyStr = 'ArrowUp'; }
else if (code === 'ArrowDown') { keyCode = 40; keyStr = 'ArrowDown'; }
else if (code === 'ArrowLeft') { keyCode = 37; keyStr = 'ArrowLeft'; }
else if (code === 'ArrowRight') { keyCode = 39; keyStr = 'ArrowRight'; }
else if (code === 'Insert') { keyCode = 45; keyStr = 'Insert'; }
else if (code === 'Delete') { keyCode = 46; keyStr = 'Delete'; }
else if (code === 'Home') { keyCode = 36; keyStr = 'Home'; }
else if (code === 'End') { keyCode = 35; keyStr = 'End'; }
else if (code === 'PageUp') { keyCode = 33; keyStr = 'PageUp'; }
else if (code === 'PageDown') { keyCode = 34; keyStr = 'PageDown'; }
else if (code === 'CapsLock') { keyCode = 20; keyStr = 'CapsLock'; }
else if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) { keyCode = 111 + parseInt(code.substring(1), 10); keyStr = code; }
else if (/^Numpad([0-9])$/.test(code)) { var np = parseInt(code.substring(6), 10); keyCode = 96 + np; keyStr = 'Numpad' + np; }
else if (code === 'NumpadDecimal') { keyCode = 110; keyStr = 'NumpadDecimal'; }
else if (code === 'NumpadAdd') { keyCode = 107; keyStr = 'NumpadAdd'; }
else if (code === 'NumpadSubtract') { keyCode = 109; keyStr = 'NumpadSubtract'; }
else if (code === 'NumpadMultiply') { keyCode = 106; keyStr = 'NumpadMultiply'; }
else if (code === 'NumpadDivide') { keyCode = 111; keyStr = 'NumpadDivide'; }
else {
var letterMatch = /^Key([A-Z])$/.exec(code);
var digitMatch = /^Digit([0-9])$/.exec(code);
if (letterMatch) { keyCode = letterMatch[1].charCodeAt(0); keyStr = letterMatch[1].toLowerCase(); }
else if (digitMatch) { keyCode = digitMatch[1].charCodeAt(0); keyStr = digitMatch[1]; }
}
sprintState.keyCode = keyCode;
sprintState.keyStr = keyStr;
return { code: code, keyCode: keyCode, keyStr: keyStr };
}
resolveSprintKey();
if (CFG.sprintKeyAuto) {
var detected = autoDetectSprintKey();
if (detected) {
sprintState.code = detected;
resolveSprintKey();
}
try {
window.addEventListener('storage', function(e) {
var d = autoDetectSprintKey();
if (d && d !== sprintState.code) {
sprintState.code = d;
resolveSprintKey();
}
});
} catch(_) {}
try {
var _sprintKeyDetected = false;
var _lastNonMoveKey = null;
window.addEventListener('keydown', function(e) {
if (!isPLActive || _sprintKeyDetected || !sprintBindingCaptured) return;
if (wHeld) return;
if (e.code === 'KeyW' || e.code === 'KeyS' || e.code === 'KeyA' || e.code === 'KeyD') return;
if (e.code === 'Escape' || e.code === 'F3') return;
_lastNonMoveKey = { code: e.code, keyCode: e.keyCode, key: e.key, time: Date.now() };
}, true);
document.addEventListener('pointerlockchange', function() {
if (!isPLActive() || _sprintKeyDetected || !sprintBindingCaptured) return;
if (_lastNonMoveKey && (Date.now() - _lastNonMoveKey.time < 2000)) {
var candidate = _lastNonMoveKey.code;
if (candidate && candidate !== sprintState.code && candidate !== 'KeyW') {
sprintState.code = candidate;
resolveSprintKey();
_sprintKeyDetected = true;
}
}
}, true);
} catch(_) {}
try {
var pollCount = 0;
function pollSprintKey() {
try {
var d = autoDetectSprintKey();
if (d && d !== sprintState.code) {
sprintState.code = d;
resolveSprintKey();
return;
}
} catch(_) {}
pollCount++;
setTimeout(pollSprintKey, pollCount > 15 ? 10000 : 2000);
}
setTimeout(pollSprintKey, 2000);
} catch(_) {}
}
var wHeld = false;
var sprintBindingCaptured = false;
var _sprintTrapPropNames = ['sprint'];
function setupSprintTrap(propName) {
try {
var desc = Object.getOwnPropertyDescriptor(Object.prototype, propName);
if (desc && desc.get && desc.set) return;
Object.defineProperty(Object.prototype, propName, {
configurable: true,
enumerable: false,
get: function() {
if (document.pointerLockElement && wHeld) return true;
return this['__eaglerLite_' + propName] || false;
},
set: function(v) {
if (!sprintBindingCaptured) {
sprintBindingCaptured = true;
}
try {
Object.defineProperty(this, '__eaglerLite_' + propName, {
value: v, writable: true, enumerable: false, configurable: true
});
} catch(_) {
this['__eaglerLite_' + propName] = v;
}
try {
Object.defineProperty(this, propName, {
configurable: true,
enumerable: true,
get: function() {
if (document.pointerLockElement && wHeld) return true;
return this['__eaglerLite_' + propName] || false;
},
set: function(v) {
this['__eaglerLite_' + propName] = v;
}
});
} catch(_) {}
try { delete Object.prototype[propName]; } catch(_) {}
}
});
} catch(_) {}
}
for (var _sti = 0; _sti < _sprintTrapPropNames.length; _sti++) {
setupSprintTrap(_sprintTrapPropNames[_sti]);
_trapPropNames.push(_sprintTrapPropNames[_sti]);
}
setInterval(function() {
if (sprintBindingCaptured) return;
for (var i = 0; i < _sprintTrapPropNames.length; i++) {
var propName = _sprintTrapPropNames[i];
var desc = Object.getOwnPropertyDescriptor(Object.prototype, propName);
if (!desc || !desc.get || !desc.set) {
setupSprintTrap(propName);
}
}
}, 5000);
function sendSprintEvent(type) {
var r = resolveSprintKey();
try {
var ev = new KeyboardEvent(type, { code: r.code, keyCode: r.keyCode, which: r.keyCode, key: r.keyStr, bubbles: true, cancelable: true });
try { Object.defineProperty(ev, 'isTrusted', { get: function() { return true; }, configurable: true }); } catch(_) {}
document.dispatchEvent(ev);
} catch(_) {}
try {
var ev2 = new KeyboardEvent(type, { code: r.code, keyCode: r.keyCode, which: r.keyCode, key: r.keyStr, bubbles: true, cancelable: true });
try { Object.defineProperty(ev2, 'isTrusted', { get: function() { return true; }, configurable: true }); } catch(_) {}
window.dispatchEvent(ev2);
} catch(_) {}
}
function isWKey(e) {
return e.code === 'KeyW' || e.keyCode === 87 || e.key === 'w' || e.key === 'W' || e.which === 87;
}
function isPLActive() {
try { return !!document.pointerLockElement; } catch(_) { return false; }
}
window.addEventListener('keydown', function(e) {
if (isWKey(e) && !e.repeat && isPLActive()) {
wHeld = true;
sendSprintEvent('keydown');
}
}, true);
window.addEventListener('keyup', function(e) {
if (isWKey(e) && isPLActive()) {
wHeld = false;
sendSprintEvent('keyup');
}
}, true);
window.addEventListener('blur', function() { wHeld = false; }, true);
document.addEventListener('pointerlockchange', function() {
if (!isPLActive()) wHeld = false;
}, true);
try {
setInterval(function() {
if (wHeld && isPLActive()) {
sendSprintEvent('keydown');
}
}, 2000);
} catch(_) {}
}
function blankCache(gl) { return { buffers: Object.create(null) }; }
function wrapGL(gl) {
if (gl.__eaglerLite) return gl;
gl.__eaglerLite = true;
var cache = blankCache(gl);
var bufferMeta = new Map();
function wrap(name, fn) {
if (typeof gl[name] === 'function') {
var orig = gl[name].bind(gl);
gl[name] = fn(orig);
return orig;
}
return null;
}
if (CFG.p8 || CFG.p12) {
try {
if (CFG.p8) gl.disable(gl.DITHER);
if (CFG.p12 && typeof gl.LINE_SMOOTH !== 'undefined') gl.disable(gl.LINE_SMOOTH);
} catch(e) {}
}
if (CFG.p14 && gl.canvas && gl.canvas.style) {
gl.canvas.style.imageRendering = 'pixelated';
}
if (CFG.p13 && typeof gl.renderbufferStorageMultisample === 'function') {
wrap('renderbufferStorageMultisample', function(orig) {
return function(target, samples, internalformat, width, height) {
try { gl.renderbufferStorage(target, internalformat, width, height); } catch(e) { orig(target, samples, internalformat, width, height); }
};
});
}
if (CFG.p10) {
try { gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE); } catch(e) {}
wrap('pixelStorei', function(orig) {
return function(pname, param) {
if (pname === gl.UNPACK_COLORSPACE_CONVERSION_WEBGL) { param = gl.NONE; }
orig(pname, param);
};
});
}
if (CFG.p11) {
wrap('getError', function(orig) {
return function() {
if (gl.isContextLost()) return 9;
return 0;
};
});
}
if (CFG.p7) {
}
var origBufferData = wrap('bufferData', function(orig) {
return function(target, dataOrSize, usage, srcOffset, length) {
if (srcOffset !== undefined) orig(target, dataOrSize, usage, srcOffset, length);
else orig(target, dataOrSize, usage);
var buf = cache.buffers[target];
if (buf) {
var size = (typeof dataOrSize === 'number') ? dataOrSize : (dataOrSize && dataOrSize.byteLength !== undefined ? dataOrSize.byteLength : 0);
if (size > 0) bufferMeta.set(buf, { size: size, usage: usage });
}
};
});
wrap('bindBuffer', function(orig) {
return function(target, buf) {
cache.buffers[target] = buf;
orig(target, buf);
};
});
wrap('bufferSubData', function(orig) {
return function(target, offset, data, srcOffset, length) {
if (CFG.p5 && offset === 0 && data) {
var bufId = cache.buffers[target];
if (bufId) {
var meta = bufferMeta.get(bufId);
if (meta && data.byteLength === meta.size) {
try { origBufferData(target, meta.size, meta.usage); } catch(_) {}
}
}
}
if (srcOffset !== undefined) orig(target, offset, data, srcOffset, length);
else orig(target, offset, data);
};
});
wrap('deleteBuffer', function(orig) {
return function(buf) {
if (buf) {
var b = cache.buffers;
for (var k in b) if (b[k] === buf) delete b[k];
if (CFG.p5) bufferMeta.delete(buf);
}
orig(buf);
};
});
if (CFG.p5) {
setInterval(function() {
if (bufferMeta.size > 1000) {
bufferMeta.clear();
}
}, 60000);
}
var _GL_TEXTURE_MIN_FILTER = gl.TEXTURE_MIN_FILTER;
var _GL_TEXTURE_MAG_FILTER = gl.TEXTURE_MAG_FILTER;
var _GL_NEAREST = gl.NEAREST;
wrap('texParameteri', function(orig) {
return function(target, pname, param) {
if (pname === _GL_TEXTURE_MIN_FILTER || pname === _GL_TEXTURE_MAG_FILTER) {
if (CFG.p4) { param = _GL_NEAREST; }
else if (CFG.p7 && pname === _GL_TEXTURE_MIN_FILTER) {
if (param === gl.NEAREST_MIPMAP_NEAREST || param === gl.LINEAR_MIPMAP_NEAREST || param === gl.NEAREST_MIPMAP_LINEAR || param === gl.LINEAR_MIPMAP_LINEAR) { param = gl.LINEAR; }
}
}
orig(target, pname, param);
};
});
wrap('drawArrays', function(orig) { return function(mode, first, count) { S.draws++; orig(mode, first, count); }; });
wrap('drawElements', function(orig) { return function(mode, count, type, offset) { S.draws++; orig(mode, count, type, offset); }; });
if (gl.canvas) {
gl.canvas.addEventListener('webglcontextrestored', function() {
try {
var fresh = blankCache(gl);
var keys = Object.keys(fresh);
for (var i = 0; i < keys.length; i++) cache[keys[i]] = fresh[keys[i]];
bufferMeta.clear();
if (CFG.p8) { try { gl.disable(gl.DITHER); } catch(e) {} }
if (CFG.p10) { try { gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE); } catch(e) {} }
if (CFG.p12 && typeof gl.LINE_SMOOTH !== 'undefined') { try { gl.disable(gl.LINE_SMOOTH); } catch(e) {} }
if (CFG.p6) {
uncapQueue.length = 0;
uncapCallbacks.clear();
uncapNextId = 1;
}
if (pendingThrottle) {
try { clearTimeout(pendingThrottle.id); } catch(_) {}
pendingThrottle = null;
}
} catch(restoreErr) {}
});
}
if (CFG.fullbright && CFG.gameVersion === '1.12.2') {
var fbOrigShaderSource = gl.shaderSource.bind(gl);
gl.shaderSource = function(shader, source) {
var patched = null;
if (typeof source === 'string' && source.indexOf('u_samplerLightmap') !== -1) {
var modified = source.replace(
/color\s*\*?=\s*(?:EAGLER_TEXTURE_2D|texture)\s*\(\s*u_samplerLightmap\b[^;]*;/gi,
'color *= vec4(1.0, 1.0, 1.0, 1.0);'
);
if (modified !== source) {
patched = modified;
}
}
if (patched !== null) {
try {
fbOrigShaderSource(shader, patched);
try { gl.compileShader(shader); } catch(ce) {}
if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
try { fbOrigShaderSource(shader, source); } catch(re) {}
}
} catch(e) {
try { fbOrigShaderSource(shader, source); } catch(re2) {}
}
return;
}
return fbOrigShaderSource(shader, source);
};
var fbLightmapTex = null;
var fbLightmapConfirmed = false;
var fbTexInfo = new Map();
var fbTexUploadCounts = new Map();
var fbActiveUnit = 0x84C0;
var fbUnitBindings = new Map();
var _GL_TEXTURE_2D = 0x0DE1;
var _GL_RGBA = 0x1908;
var _GL_UNSIGNED_BYTE = 0x1401;
var _GL_RGBA8 = 0x8058;
var _GL_RGBA4 = 0x8056;
var _GL_RGB5_A1 = 0x8057;
var _fbWhiteTexData = null;
function fbGetWhiteTexture() {
if (!_fbWhiteTexData) {
_fbWhiteTexData = new Uint8Array(16 * 16 * 4);
for (var i = 0; i < _fbWhiteTexData.length; i += 4) {
_fbWhiteTexData[i] = 255;
_fbWhiteTexData[i + 1] = 255;
_fbWhiteTexData[i + 2] = 255;
_fbWhiteTexData[i + 3] = 255;
}
}
return _fbWhiteTexData;
}
function fbGetActiveTex() {
var bindings = fbUnitBindings.get(fbActiveUnit);
if (!bindings) return null;
return bindings[_GL_TEXTURE_2D] || null;
}
function fbSetBinding(target, texture) {
var bindings = fbUnitBindings.get(fbActiveUnit);
if (!bindings) {
bindings = {};
fbUnitBindings.set(fbActiveUnit, bindings);
}
bindings[target] = texture;
}
function fbIsRGBAFormat(fmt) {
return fmt === _GL_RGBA8 || fmt === _GL_RGBA || fmt === _GL_RGBA4 || fmt === _GL_RGB5_A1;
}
function fbTryConfirmLightmap(activeTex) {
if (!activeTex || fbLightmapConfirmed) return;
var info = fbTexInfo.get(activeTex);
if (info) {
if (info.w === 16 && info.h === 16) {
fbLightmapTex = activeTex;
fbLightmapConfirmed = true;
return;
}
return;
}
var count = fbTexUploadCounts.get(activeTex) || 0;
count++;
fbTexUploadCounts.set(activeTex, count);
if (count >= 5) {
fbLightmapTex = activeTex;
fbLightmapConfirmed = true;
fbTexUploadCounts.delete(activeTex);
}
}
function fbMaybeOverride(activeTex, dataArgIndex, args) {
if (!activeTex) return false;
if (fbLightmapConfirmed && activeTex === fbLightmapTex) {
args[dataArgIndex] = fbGetWhiteTexture();
return true;
}
if (!fbLightmapConfirmed) {
fbTryConfirmLightmap(activeTex);
if (fbLightmapConfirmed && activeTex === fbLightmapTex) {
args[dataArgIndex] = fbGetWhiteTexture();
return true;
}
}
return false;
}
var fbOrigActiveTexture = gl.activeTexture.bind(gl);
gl.activeTexture = function(texture) {
fbActiveUnit = texture;
return fbOrigActiveTexture(texture);
};
var fbOrigBindTexture = gl.bindTexture.bind(gl);
gl.bindTexture = function(target, texture) {
if (target === _GL_TEXTURE_2D) {
fbSetBinding(_GL_TEXTURE_2D, texture);
}
return fbOrigBindTexture(target, texture);
};
var fbOrigTexImage2D = gl.texImage2D.bind(gl);
gl.texImage2D = function() {
var activeTex = fbGetActiveTex();
if (arguments.length >= 6 && arguments[0] === _GL_TEXTURE_2D) {
var level = arguments[1];
var internalFormat = arguments[2];
var w = arguments[3];
var h = arguments[4];
if (level === 0 && fbIsRGBAFormat(internalFormat) && activeTex) {
fbTexInfo.set(activeTex, { w: w, h: h });
}
}
if (arguments.length === 9 && arguments[0] === _GL_TEXTURE_2D && arguments[1] === 0 && arguments[8]) {
var w2 = arguments[3], h2 = arguments[4], format2 = arguments[6], type2 = arguments[7];
if (w2 === 16 && h2 === 16 && format2 === _GL_RGBA && type2 === _GL_UNSIGNED_BYTE) {
fbMaybeOverride(activeTex, 8, arguments);
}
}
return fbOrigTexImage2D.apply(gl, arguments);
};
if (gl.texStorage2D) {
var fbOrigTexStorage2D = gl.texStorage2D.bind(gl);
gl.texStorage2D = function(target, levels, internalFormat, w, h) {
var activeTex = fbGetActiveTex();
if (target === _GL_TEXTURE_2D && levels === 1 && fbIsRGBAFormat(internalFormat) && activeTex) {
fbTexInfo.set(activeTex, { w: w, h: h });
}
return fbOrigTexStorage2D(target, levels, internalFormat, w, h);
};
}
var fbOrigTexSubImage2D = gl.texSubImage2D.bind(gl);
gl.texSubImage2D = function() {
var activeTex = fbGetActiveTex();
if (arguments.length === 9 && arguments[0] === _GL_TEXTURE_2D && arguments[1] === 0 && arguments[8]) {
var xoff = arguments[2], yoff = arguments[3];
var w = arguments[4], h = arguments[5];
var format = arguments[6], type = arguments[7];
if (w === 16 && h === 16 && format === _GL_RGBA && type === _GL_UNSIGNED_BYTE && xoff === 0 && yoff === 0) {
if (!fbLightmapConfirmed) {
fbTryConfirmLightmap(activeTex);
}
fbMaybeOverride(activeTex, 8, arguments);
}
}
return fbOrigTexSubImage2D.apply(gl, arguments);
};
var fbOrigDeleteTexture = gl.deleteTexture.bind(gl);
gl.deleteTexture = function(texture) {
if (texture === fbLightmapTex) {
fbLightmapTex = null;
fbLightmapConfirmed = false;
}
fbTexInfo.delete(texture);
fbTexUploadCounts.delete(texture);
fbUnitBindings.forEach(function(bindings) {
for (var target in bindings) {
if (bindings[target] === texture) delete bindings[target];
}
});
return fbOrigDeleteTexture(texture);
};
if (gl.canvas) {
gl.canvas.addEventListener('webglcontextrestored', function() {
fbLightmapTex = null;
fbLightmapConfirmed = false;
fbTexInfo.clear();
fbTexUploadCounts.clear();
fbUnitBindings.clear();
fbActiveUnit = 0x84C0;
});
}
}
return gl;
}
var _getCtx = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type, opts) {
if (CFG.p1 && (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl')) {
var tuned = {};
if (opts && typeof opts === 'object') {
for (var ck in opts) { if (Object.prototype.hasOwnProperty.call(opts, ck)) tuned[ck] = opts[ck]; }
}
tuned.antialias = false;
tuned.powerPreference = 'high-performance';
opts = tuned;
}
var ctx = _getCtx.call(this, type, opts);
if (ctx && (CFG.p4 || CFG.p5 || CFG.fullbright || CFG.p7 || CFG.p8 || CFG.p10 || CFG.p11 || CFG.p12 || CFG.p13 || CFG.p14) && (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl')) {
try { return wrapGL(ctx); } catch(e) { ctx.__eaglerLite = true; }
}
return ctx;
};
var uncapChannel = new MessageChannel();
var uncapQueue = [];
var uncapCallbacks = new Map();
var uncapNextId = 1;
uncapChannel.port1.onmessage = function() {
var id = uncapQueue.shift();
if (id === undefined) return;
var cb = uncapCallbacks.get(id);
uncapCallbacks.delete(id);
if (cb) { try { cb(performance.now()); } catch(e) {} }
};
var origRAF = window.requestAnimationFrame.bind(window);
var origCAF = window.cancelAnimationFrame.bind(window);
var pendingThrottle = null;
var _fpsLimitMinInterval = 0;
var _fpsLastFrameTime = 0;
var _perfNow = (typeof performance !== 'undefined' && performance.now) ? performance.now.bind(performance) : function() { return Date.now(); };
if (CFG.fpsLimiter && typeof CFG.maxFPS === 'number' && CFG.maxFPS > 0 && CFG.maxFPS < 1000) {
_fpsLimitMinInterval = 1000 / CFG.maxFPS;
}
var _fpsLimitTimers = new Map();
window.requestAnimationFrame = function(cb) {
if (document.hidden && CFG.p3) {
if (pendingThrottle) clearTimeout(pendingThrottle.id);
var tid = setTimeout(function() {
if (pendingThrottle && pendingThrottle.id === tid) pendingThrottle = null;
try { cb(_perfNow()); } catch(e) {}
}, 1000);
pendingThrottle = { id: tid, cb: cb };
return tid;
}
if (_fpsLimitMinInterval > 0 && !(CFG.p6 && document.pointerLockElement)) {
var now = _perfNow();
var elapsed = now - _fpsLastFrameTime;
if (elapsed < _fpsLimitMinInterval) {
var delay = _fpsLimitMinInterval - elapsed;
var fid = setTimeout(function() {
_fpsLastFrameTime = _perfNow();
_fpsLimitTimers.delete(fid);
try { cb(_fpsLastFrameTime); } catch(e) {}
}, delay);
_fpsLimitTimers.set(fid, cb);
return fid;
}
_fpsLastFrameTime = now;
return origRAF(cb);
}
if (CFG.p6 && document.pointerLockElement) {
var uid = uncapNextId++;
uncapCallbacks.set(uid, cb);
uncapQueue.push(uid);
uncapChannel.port2.postMessage(0);
return uid;
}
return origRAF(cb);
};
window.cancelAnimationFrame = function(id) {
if (id == null) return;
if (_fpsLimitTimers.has(id)) {
clearTimeout(id);
_fpsLimitTimers.delete(id);
return;
}
if (uncapCallbacks.has(id)) {
uncapCallbacks.delete(id);
var idx = uncapQueue.indexOf(id);
if (idx !== -1) uncapQueue.splice(idx, 1);
return;
}
if (pendingThrottle && pendingThrottle.id === id) {
clearTimeout(id);
pendingThrottle = null;
return;
}
try { origCAF(id); } catch(e) {}
try { clearTimeout(id); } catch(e) {}
};
if (CFG.p3) {
document.addEventListener('visibilitychange', function() {
if (!document.hidden && pendingThrottle) {
clearTimeout(pendingThrottle.id);
var cb = pendingThrottle.cb;
pendingThrottle = null;
origRAF(function(t) { try { cb(t); } catch(e) {} });
}
});
}
if (CFG.hud) {
var hud = document.createElement('div');
hud.style.position = 'fixed';
hud.style.top = '4px';
hud.style.left = '4px';
hud.style.background = 'rgba(0,0,0,0.65)';
hud.style.color = '#ffffff';
hud.style.font = 'bold 11px/1.9 "Courier New",monospace';
hud.style.padding = '5px 11px';
hud.style.borderRadius = '4px';
hud.style.zIndex = '999999';
hud.style.pointerEvents = 'none';
hud.style.userSelect = 'none';
hud.style.whiteSpace = 'pre';
hud.style.border = '1px solid rgba(255,255,255,0.15)';
hud.style.letterSpacing = '0.02em';
function attachHUD() { if (document.body) document.body.appendChild(hud); }
if (document.body) attachHUD(); else document.addEventListener('DOMContentLoaded', attachHUD);
var t0 = performance.now(), fr = 0, d0 = 0, hudDirty = false;
var _hudConnState = 'IDLE';
function _hudSetConnState(state) { _hudConnState = state; }
function hudTick() { origRAF(hudTick); fr++; var now = performance.now(), dt = now - t0; if (dt < 500) return; var fps = (fr / dt * 1000).toFixed(1); var dpf = ((S.draws - d0) / fr).toFixed(1); var thrtl = CFG.p3 && document.hidden ? 'YES' : 'NO'; var connLine = ''; if (_hudConnState !== 'IDLE') connLine = '\nConn      ' + _hudConnState; hud.textContent = 'FPS       ' + fps + '\n' + 'Draw/f    ' + dpf + '\n' + 'Throttled ' + thrtl + connLine; t0 = now; fr = 0; d0 = S.draws; }
hudTick();
var f3 = false;
window.addEventListener('keydown', function(e) { if (e.code === 'F3') f3 = true; if (e.code === 'KeyO' && f3) hud.style.display = hud.style.display === 'none' ? '' : 'none'; });
window.addEventListener('keyup', function(e) { if (e.code === 'F3') f3 = false; });
}
if (CFG.crystalOptimizer) {
document.addEventListener('contextmenu', function(e) {
if (document.pointerLockElement) e.preventDefault();
});
var capturedInstances = [];
var capturedSet = new Set();
var trapPropNames = ['rightClickDelayTimer', 'leftClickCounter'];
for (var _tpi = 0; _tpi < trapPropNames.length; _tpi++) {
_trapPropNames.push(trapPropNames[_tpi]);
}
function setupCooldownTrap(propName) {
try {
var desc = Object.getOwnPropertyDescriptor(Object.prototype, propName);
if (desc && desc.get && desc.set) return;
Object.defineProperty(Object.prototype, propName, {
configurable: true,
enumerable: false,
get: function() {
if (document.pointerLockElement) {
var v = this['__eaglerLite_' + propName] || 0;
if (v <= 2) return 0;
return v;
}
return this['__eaglerLite_' + propName] || 0;
},
set: function(v) {
if (!capturedSet.has(this)) {
capturedSet.add(this);
capturedInstances.push(this);
}
try {
Object.defineProperty(this, '__eaglerLite_' + propName, {
value: v, writable: true, enumerable: false, configurable: true
});
} catch(_) {
this['__eaglerLite_' + propName] = v;
}
try {
Object.defineProperty(this, propName, {
configurable: true,
enumerable: true,
get: function() {
if (document.pointerLockElement) {
var v = this['__eaglerLite_' + propName] || 0;
if (v <= 2) return 0;
return v;
}
return this['__eaglerLite_' + propName] || 0;
},
set: function(v) {
this['__eaglerLite_' + propName] = v;
}
});
} catch(_) {}
try { delete Object.prototype[propName]; } catch(_) {}
}
});
} catch(_) {}
}
for (var i = 0; i < trapPropNames.length; i++) {
setupCooldownTrap(trapPropNames[i]);
}
setInterval(function() {
for (var i = 0; i < trapPropNames.length; i++) {
var propName = trapPropNames[i];
var desc = Object.getOwnPropertyDescriptor(Object.prototype, propName);
if (!desc || !desc.get || !desc.set) {
setupCooldownTrap(propName);
}
}
}, 5000);
setTimeout(function() {
if (capturedInstances.length === 0) {
for (var i = 0; i < trapPropNames.length; i++) {
try { delete Object.prototype[trapPropNames[i]]; } catch(_) {}
}
startHeuristicScan();
}
}, 60000);
var heuristicActive = false;
var heuristicCandidates = new Map();
var HEURISTIC_HARD_TIMEOUT_MS = 5 * 60 * 1000;
var HEURISTIC_MAX_ITERATIONS = 300;
function startHeuristicScan() {
if (heuristicActive) return;
heuristicActive = true;
var scanStartTime = performance.now();
var scanCount = 0;
var scanInterval = setInterval(function() {
if (capturedInstances.length > 0) {
scanInstanceFields(capturedInstances[capturedInstances.length - 1]);
}
scanCount++;
var elapsed = performance.now() - scanStartTime;
if (scanCount > HEURISTIC_MAX_ITERATIONS || elapsed > HEURISTIC_HARD_TIMEOUT_MS) {
clearInterval(scanInterval);
heuristicActive = false;
heuristicCandidates.clear();
}
}, 1000);
}
function scanInstanceFields(obj) {
if (!obj || typeof obj !== 'object') return;
try {
var keys = Object.keys(obj);
for (var i = 0; i < keys.length; i++) {
var key = keys[i];
if (key.indexOf('__eaglerLite_') === 0) continue;
if (key === 'rightClickDelayTimer' || key === 'leftClickCounter') continue;
var val;
try { val = obj[key]; } catch(_) { continue; }
if (typeof val !== 'number' || val < 0 || val > 20 || val % 1 !== 0) continue;
var trackKey = key;
var track = heuristicCandidates.get(trackKey);
if (!track) {
heuristicCandidates.set(trackKey, { obj: obj, values: [val], count: 1 });
} else {
track.values.push(val);
if (track.values.length > 10) track.values.shift();
track.count++;
if (track.values.length >= 5) {
var decremented = 0;
var reset = 0;
for (var j = 1; j < track.values.length; j++) {
var diff = track.values[j] - track.values[j - 1];
if (diff === -1) decremented++;
else if (diff > 0 && (track.values[j] === 4 || track.values[j] === 10)) reset++;
}
if (decremented >= 2 || reset >= 1) {
overrideHeuristicField(obj, trackKey);
heuristicCandidates.delete(trackKey);
}
}
}
}
} catch(_) {}
}
function overrideHeuristicField(obj, fieldName) {
try {
var currentVal = obj[fieldName];
Object.defineProperty(obj, '__eaglerLite_heuristic_' + fieldName, {
value: currentVal, writable: true, enumerable: false, configurable: true
});
Object.defineProperty(obj, fieldName, {
configurable: true,
enumerable: true,
get: function() {
if (document.pointerLockElement) {
var v = this['__eaglerLite_heuristic_' + fieldName] || 0;
if (v <= 2) return 0;
return v;
}
return this['__eaglerLite_heuristic_' + fieldName] || 0;
},
set: function(v) {
this['__eaglerLite_heuristic_' + fieldName] = v;
}
});
} catch(_) {}
}
}
if (CFG.autoReconnect) {
try {
var _arState = {
lastServerURI: null,
retryCount: 0,
maxRetries: (typeof CFG.reconnectRetries === 'number' && CFG.reconnectRetries > 0) ? CFG.reconnectRetries : 1,
delayMs: (typeof CFG.reconnectDelay === 'number' && CFG.reconnectDelay >= 0) ? CFG.reconnectDelay : 2500,
pendingTimer: null,
cancelled: false,
lastScreen: null,
manualDisconnectPending: false,
connected: false
};
function _arGetLastServerURI() {
try {
if (window.__eaglerLastServerURI) return window.__eaglerLastServerURI;
} catch(_) {}
return null;
}
function _arCancelPending() {
if (_arState.pendingTimer) {
try { clearTimeout(_arState.pendingTimer); } catch(_) {}
_arState.pendingTimer = null;
}
}
function _arScheduleReconnect() {
if (_arState.cancelled) return;
if (_arState.retryCount >= _arState.maxRetries) {
return;
}
var uri = _arGetLastServerURI();
if (!uri) {
return;
}
_arCancelPending();
_arState.retryCount++;
var backoffDelay = _arState.delayMs;
if (_arState.retryCount > 1) {
backoffDelay = _arState.delayMs * Math.pow(1.5, _arState.retryCount - 1);
}
_arState.pendingTimer = setTimeout(function() {
_arState.pendingTimer = null;
if (_arState.cancelled) return;
if (_arState.connected) {
return;
}
_arDoReconnect();
}, backoffDelay);
}
function _arDoReconnect() {
var uri = _arGetLastServerURI();
if (!uri) {
return;
}
try {
if (window.__eaglerReconnect) {
window.__eaglerReconnect(uri);
return;
}
} catch(_) {}
try {
var baseUrl = uri;
try {
var parsed = new URL(uri);
var pathParts = parsed.pathname.split('/').filter(function(p) { return p.length > 0; });
if (pathParts.length > 0) {
window.location.hash = '#server=' + parsed.host + (pathParts.length > 0 ? '/' + pathParts.join('/') : '');
}
} catch(_) {}
} catch(_) {}
}
function _arOnScreenChange(screenName) {
try {
if (typeof screenName !== 'string') return;
if (screenName === 'net.minecraft.client.gui.GuiDisconnected') {
if (_arState.manualDisconnectPending) {
_arState.manualDisconnectPending = false;
return;
}
if (_arState.lastScreen === 'net.minecraft.client.gui.GuiIngameMenu') {
return;
}
_arState.connected = false;
_arScheduleReconnect();
} else if (screenName === 'net.minecraft.client.gui.GuiIngameMenu') {
_arState.manualDisconnectPending = true;
} else if (screenName === 'net.minecraft.client.multiplayer.GuiConnecting' || screenName === 'net.minecraft.client.gui.GuiConnecting') {
_arCancelPending();
_arState.connected = false;
} else if (screenName === 'net.minecraft.client.multiplayer.GuiWorldSelection' || screenName === 'net.minecraft.client.gui.GuiMainMenu' || screenName === 'net.minecraft.client.gui.GuiMultiplayer') {
_arCancelPending();
_arState.cancelled = true;
} else if (screenName === 'net.minecraft.client.gui.GuiIngame' || screenName === 'net.minecraft.client.multiplayer.GuiIngame') {
_arState.connected = true;
_arState.cancelled = false;
_arState.retryCount = 0;
_arState.manualDisconnectPending = false;
}
_arState.lastScreen = screenName;
} catch(_) {}
}
try {
if (!window.eaglercraftXOpts) window.eaglercraftXOpts = {};
if (!window.eaglercraftXOpts.hooks) window.eaglercraftXOpts.hooks = {};
var _origScreenChanged = window.eaglercraftXOpts.hooks.screenChanged;
window.eaglercraftXOpts.hooks.screenChanged = function(screenName, sw, sh, rw, rh, scale) {
try { _arOnScreenChange(screenName); } catch(_) {}
try {
if (typeof _origScreenChanged === 'function') {
_origScreenChanged(screenName, sw, sh, rw, rh, scale);
}
} catch(_) {}
};
} catch(_) {}
try {
window.addEventListener('keydown', function(e) {
if (e.code === 'Escape' || e.keyCode === 27) {
_arCancelPending();
}
}, true);
} catch(_) {}
} catch(_) {}
}
} catch (optimizerErr) {
_cleanupTraps();
}
}

function launchGame(pastedClient) {
  if (_launching) {
    try { window.__eaglerliteToast('Launch already in progress - please wait', 'load'); } catch(_) {}
    return;
  }
  _launching = true;
  var launchBtn = null;
  try { launchBtn = document.getElementById('launchBtn'); } catch(_) {}
  try { if (launchBtn && launchBtn.disabled) { _launching = false; return; } } catch(_) {}
  try { setBusy(true); } catch(_) {}
  try { setProgress(0.1); } catch(_) {}
  _setLaunchState('init', 'Preparing launch...', 'load');
  if (_launchTimeout) { try { clearTimeout(_launchTimeout); } catch(_) {} _launchTimeout = null; }
  _launchTimeout = setTimeout(function() {
    if (_launching) {
      _launching = false;
      try { setBusy(false); } catch(_) {}
      _setLaunchState('timeout', 'Launch timed out (120s no readiness signal) - try the manual paste fallback.', 'err');
      try { window.__eaglerliteReportError(new Error('Launch timed out (120s no readiness signal)'), 'launchGame.timeout'); } catch(_) {}
      try { logActivity('Launch timed out (120s no readiness signal)', 'err'); } catch(_) {}
      try { pushHistory('timeout', 'err', '120s no readiness signal'); } catch(_) {}
      try { _revealManualPaste(); } catch(_) {}
    }
  }, 120000);
  try {
    _ensureReadyListener();
    _setLaunchState('reading-config', 'Reading configuration...', 'load');
    function _chk(id, def) {
      try { var el = document.getElementById(id); if (el && typeof el.checked === 'boolean') return el.checked; } catch(_) {}
      return def;
    }
    function _txt(id, def) {
      try { var el = document.getElementById(id); if (el && typeof el.value === 'string' && el.value.trim()) return el.value.trim(); } catch(_) {}
      return def;
    }
    function _num(id, def) {
      try { var el = document.getElementById(id); if (el && el.value) { var n = parseInt(el.value, 10); if (!isNaN(n)) return n; } } catch(_) {}
      return def;
    }
    var tabName = 'Eaglercraft';
    try { tabName = _txt('tabName', 'Eaglercraft') || 'Eaglercraft'; } catch(_) {}
    var sprintKey = 'ControlLeft';
    try { sprintKey = _txt('sprintKey', 'ControlLeft') || 'ControlLeft'; } catch(_) {}
    var favicon = '';
    try { favicon = _txt('favicon', ''); } catch(_) {}
    var faviconPreset = 'custom';
    try { faviconPreset = _txt('faviconPreset', 'custom') || 'custom'; } catch(_) {}
    var panicLink = 'https://classroom.google.com';
    try { panicLink = _txt('panicLink', 'https://classroom.google.com') || 'https://classroom.google.com'; } catch(_) {}
    var panicKey = 'Equal';
    try { panicKey = _txt('panicKey', 'Equal') || 'Equal'; } catch(_) {}
    var stripReferrer = true;
    try { stripReferrer = _chk('ch_stripReferrer', true); } catch(_) {}
    var cfg = {
      p1: _chk('ch1', true), p3: _chk('ch3', true), p4: _chk('ch4', true), p5: _chk('ch5', true),
      p6: _chk('ch6', true), p7: _chk('ch11', true), p8: _chk('ch12', true), p9: _chk('ch13', true),
      p10: _chk('ch14', true), p11: _chk('ch15', true), p12: _chk('ch16', true), p13: _chk('ch17', true),
      p14: _chk('ch18', true), fullbright: _chk('ch8', true), autosprint: _chk('ch9', true),
      zoom: _chk('ch10', true), hud: _chk('ch7', true), sprintKeyAuto: _chk('ch2', true),
      crystalOptimizer: _chk('ch19', true), autoReconnect: _chk('ch20', true), fpsLimiter: _chk('ch21', false),
      tabName: tabName, sprintKey: sprintKey, favicon: favicon, faviconPreset: faviconPreset,
      panicLink: panicLink, panicKey: panicKey, gameVersion: '1.12.2',
      reconnectDelay: _num('reconnectDelay', 2500), reconnectRetries: _num('reconnectRetries', 1),
      maxFPS: _num('maxFPS', 120)
    };
    var warnings = _validateLaunchConfig(cfg);
    for (var wi = 0; wi < warnings.length; wi++) {
      try { window.__eaglerliteToast(warnings[wi], 'load'); } catch(_) {}
    }
    try { safeSet('eaglerLiteLastLaunch_v2', JSON.stringify(cfg)); } catch(_) {}
    var pasted = null;
    if (typeof pastedClient === 'string' && pastedClient.replace(/\s/g, '').length > 0) {
      if (pastedClient.length < 100000) {
        _launching = false;
        try { setBusy(false); } catch(_) {}
        if (_launchTimeout) { try { clearTimeout(_launchTimeout); } catch(_) {} _launchTimeout = null; }
        try { window.__eaglerliteToast('Pasted client source is too small (' + pastedClient.length + ' chars) - expected the full Eaglercraft_1.12.js (~31.5MB). Paste the complete file.', 'err'); } catch(_) {}
        try { logActivity('Paste rejected: too small (' + pastedClient.length + ' chars)', 'err'); } catch(_) {}
        return;
      }
      var looksJs = pastedClient.indexOf('$rt_seed') !== -1 || pastedClient.indexOf('"use strict"') === 0;
      if (!looksJs) {
        _launching = false;
        try { setBusy(false); } catch(_) {}
        if (_launchTimeout) { try { clearTimeout(_launchTimeout); } catch(_) {} _launchTimeout = null; }
        try { window.__eaglerliteToast('Pasted content does not look like the raw Eaglercraft_1.12.js client source - paste the full client JS file, not XML or HTML.', 'err'); } catch(_) {}
        try { logActivity('Paste rejected: content does not look like the client JS', 'err'); } catch(_) {}
        return;
      }
      pasted = pastedClient;
    }
    var optiCode = '';
    try {
      optiCode = '(' + EaglerLiteOptimizer.toString() + ')(' + JSON.stringify(cfg) + ');';
      optiCode = optiCode.replace(/<\/script/gi, '<\\/script');
    } catch(optiErr) {
      try { window.__eaglerliteReportError(optiErr, 'launchGame.buildOptimizer'); } catch(_) {}
      optiCode = '';
    }
    _setLaunchState('building-srcdoc', 'Building KA game frame...', 'load');
    try { setProgress(0.3); } catch(_) {}
    var srcdoc;
    try {
      srcdoc = buildKASrcdoc(cfg, { stripReferrer: stripReferrer, optimizerCode: optiCode, pastedClient: pasted });
    } catch(buildErr) {
      try { window.__eaglerliteReportError(buildErr, 'launchGame.buildKASrcdoc'); } catch(_) {}
      throw buildErr;
    }
    _setLaunchState('injecting-frame', 'Injecting frame into KA document...', 'load');
    try { setProgress(0.7); } catch(_) {}
    var frame = document.getElementById('kaGameFrame');
    if (!frame) {
      frame = document.createElement('iframe');
      frame.id = 'kaGameFrame';
      frame.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:9999;background:var(--bg);';
      try { frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups allow-modals allow-presentation allow-orientation-lock'); } catch(_) {}
      try { frame.setAttribute('allow', 'autoplay; gamepad'); } catch(_) {}
      try { frame.setAttribute('allowfullscreen', ''); } catch(_) {}
      try {
        frame.addEventListener('error', function(ev) {
          try { window.__eaglerliteToast('Game frame error event - retrying with fallback srcdoc', 'err'); } catch(_) {}
          try { window.__eaglerliteReportError(new Error('iframe error event'), 'launchGame.iframe.error'); } catch(_) {}
          try {
            if (!frame.getAttribute('data-retried')) {
              frame.setAttribute('data-retried', '1');
              var fallbackSrcdoc = buildKASrcdoc(cfg, { stripReferrer: stripReferrer, fallback: true });
              try { frame.srcdoc = fallbackSrcdoc; } catch(_) {}
            }
          } catch(_) {}
        });
        frame.addEventListener('load', function() {
          try { window.__eaglerliteToast('Game frame loaded', 'ok'); } catch(_) {}
          try {
            var __curSt = '';
            try { var __stEl = document.getElementById('status'); if (__stEl) __curSt = __stEl.textContent || ''; } catch(_) {}
            if (__curSt.indexOf('fail') === -1 && __curSt.indexOf('Runtime failed') === -1 && __curSt.indexOf('timed out') === -1) {
              _setLaunchState('iframe-loaded', 'Game frame loaded - waiting for runtime...', 'load');
            }
          } catch(_) {}
        });
      } catch(_) {}
      if (document.body) {
        document.body.appendChild(frame);
      } else {
        _setLaunchState('waiting-body', 'Waiting for document body...', 'load');
        document.addEventListener('DOMContentLoaded', function() {
          try { document.body.appendChild(frame); } catch(_) {}
        });
      }
    }
    var bar = document.getElementById('embedCloseBar');
    if (bar) bar.className = '';
    try { _installKeyRelay(); } catch(_) {}
    try { frame.srcdoc = srcdoc; } catch(setErr) {
      try { window.__eaglerliteReportError(setErr, 'launchGame.frame.srcdoc'); } catch(_) {}
      throw setErr;
    }
    try { document.body.style.overflow = 'hidden'; } catch(_) {}
    if (pasted) {
      _setLaunchState('iframe-ready', 'Game frame injected - executing pasted Eaglercraft 1.12.2 client...', 'load');
    } else {
      _setLaunchState('iframe-ready', 'Game frame injected - loading Eaglercraft 1.12.2 client chunks...', 'load');
    }
    try { setProgress(0.85); } catch(_) {}
    try { logActivity('Game frame injected, awaiting client readiness', 'load'); } catch(_) {}
    try { pushHistory(pasted ? 'ka-iframe-paste' : 'ka-iframe', 'load', pasted ? 'pasted client source' : 'chunk-based 1.12.2 client'); } catch(_) {}
    var closeBtn = document.getElementById('embedCloseBtn');
    if (closeBtn) {
      try {
        var newClose = closeBtn.cloneNode(true);
        closeBtn.parentNode.replaceChild(newClose, closeBtn);
        newClose.addEventListener('click', function() {
          try {
            try { cleanup(); } catch(_) {}
            try { setStatus('Game frame closed. Ready to launch again.', 'load'); } catch(_) {}
            try { logActivity('Game frame closed by user', 'load'); } catch(_) {}
          } catch(closeErr) { try { window.__eaglerliteReportError(closeErr, 'launchGame.closeBtn'); } catch(_) {} }
        });
      } catch(cloneErr) { try { window.__eaglerliteReportError(cloneErr, 'launchGame.cloneCloseBtn'); } catch(_) {} }
    }
  } catch (e) {
    try { if (_launchTimeout) { clearTimeout(_launchTimeout); _launchTimeout = null; } } catch(_) {}
    _launching = false;
    try { setBusy(false); } catch(_) {}
    try { setStatus('Error launching: ' + e.message, 'err'); } catch(_) {}
    try { logActivity('Launch error: ' + e.message, 'err'); } catch(_) {}
    try { pushHistory('error', 'err', e.message); } catch(_) {}
    try { window.__eaglerliteReportError(e, 'launchGame'); } catch(_) {}
    try { _revealManualPaste(); } catch(_) {}
  }
}
window.launchGame = launchGame;

try { window.__eaglerliteBindClick('launchBtn', launchGame); } catch(_) {}
try { window.__eaglerliteBindClick('downloadBtn', downloadLauncher); } catch(_) {}
try { window.__eaglerliteBindEvent('tabName', 'keydown', function(e) { if (e.key === 'Enter') launchGame(); }); } catch(_) {}


var CONFIG_KEY = 'eaglerLiteConfig_v1';
var DEFAULTS = {
  ch1: true, ch2: true, ch3: true, ch4: true, ch5: true, ch6: true,
  ch7: true, ch8: true, ch9: true, ch10: true, ch11: true, ch12: true,
  ch13: true, ch14: true, ch15: true, ch16: true, ch17: true, ch18: true,
  ch19: true, ch20: true, ch21: false,

  ch_stripReferrer: true,
  faviconPreset: 'custom',
  _schema: 2,
  gameVersion: '1.12.2',
  tabName: 'Home - Classroom',
  favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFXklEQVR42p2XS4gcRRjHf1X9mtnNvpNNNpuHZjURsyRZUbwYIYooKF6E3PTqQVQQBC/iVdCbFx/kohc9CF48yIpe4l5y0SRC4ooJQXeDmuxO9jEz3dX1eeienq6ZnmRxoIfq6qr6vvr+/++lthZnhOIniEgxzh5ASuO7zf+Pvb4jHIUBFJSnq3+D5stLSmtUvkUDurTZ75wkQIRhWBtXW+dW5fmeG1VZoGKNEU3LesUlfQArEOqUy+1xs2SmbY1U2QISesyW2ao7Z7ElBaRsouJdUAgtfHkiWPVPBrd1WzQa8EUEiyLEsGSm7Zvrj4dTuoXJdRTpCKTEj2xO8lt21BGR7trSekHwELZtJB+OLanHwr9pSoTOOCAF6hGpmtItJnUbg8ourLpHikvXYk56rFUYvKSQh/AvqJoyDk/8MmYCGFT2iHKR7xOuijkpfR/A+eJs61K8S8J+DKtN30vxqvUDvaLiu5/buStcOqajUngZY5Xfxoqt0M+h40DldK+LCTsQLoJWmrY1xNaglabszgNvXMYqV0uXOFwo4EbE6sM2kib7hyaYro2xkTRdwbKDKOVyQFH2p6r9SilEBAVsmZi35l/kjfkXSMXy/s9f8/GV7xgJ6qRiUSgHqoJi94KgCidBSKyhbRIAtk3M8YmDvHPyJWo6YNSv8+7CWe4fmaaVxogIsU1IrHEs4gQvVwFxHEZKUAiCFeHgyB4empjFVx6pWCIvwNOaJOdAoD1CHWBs9u3hyUMc2LWb9K5QdDjQiSQiDpEUkKQpM0MTnJi6j2PjBzg6PkvkBfxy6xqfL//IUDRELajx6ZVFlu+sFMKPjs+ysOcI0/UxjE17PN8NEr7jBVKOcBmOntbo/IhAe9lYebz20yd8dmURIykXb19nNBhCoQi0Bwie0vhaZ4RULtCDAxE2M0iuSKB9/ty8RaA8hvyI5cYqa+1NJqJdPLrnAUaCIQAemZrjt8YKjXiTS7euMzc2QyPeYmVrjUB7WDLyOgmyygtsTwhNrCHUHqvbawjQtgmvH3+elx88w9zoPmp+BEAzaXG1scK5q4t8de08vzdWsWLRQGwNvvYGYuCXUp4TB6wIc6N7OTQyTd0PSazhlbkzPHNoATEprTRmK97OEo3SnJo8zEenX+Xp2RN8ee08kQ7YNC3+uHOTGxv/4PWm8cILRPqKjyQ17B+eZH7qMHU/pJ0m7K2N89TMPK12i3aa4ClNoL2MF0rRTBOSuM2zs6eYCHcRW8OwH7Gw+wjT9XESMSil+jzRgaAckEMvILaGJE1JbQbOnaRZELLKoCZXJKt8UsRmFq15QRYLlAyAoCTaiuBpnxsb/7C6tVYUHReU4oe/LvYlpN7wKyKsJ9tZgsoXdHggVu7lBd03Y1Nia0oeKqzHm/RWiEiv7TJOIF2rKpX5uyteuulY8nSM5EkoT9GZz3dDk6eDvoq3V3iRzpWbimUAcH5/LpCBG5wc31MfFsW3s1G5Jhd2BoHcpfSvFpxZxEjal9g6tYM3oLFwvEArxEPwsEWilFKYrsqYUghRjPhRBSSK2BqsjfGxTlPSV5Q2RbNts0OMG8D7b5z/KaUwJubw6D6+f+49Qu2T5qHXiGUyGubtC19w7tI3EA7TFK8fAg3E4nE6vOl9MLZEXaVZWJad9WdGLOPhELt/baOsBpW5rkWo6YCz65c5NrUMus6T4U1i6bZnavPbUDq9S02l+D11+70bwO6wsQHthttbisBwAMOTQATGQqubILvNqcohsBL1cFeqJfZYRwH+qEZHYFqCKmnRskKzafE1eFqqm1MqOteB5pcBa1KL9gW/BpJ222zd7UzQobv3P84Uh9XBoaIYAAAAAElFTkSuQmCC',
  sprintKey: 'ControlLeft',
  panicLink: 'https://classroom.google.com',
  panicKey: 'Equal',
  reconnectDelay: '2500',
  reconnectRetries: '1',
  maxFPS: '120',
  
  theme: 'dark',
  'details_connection': true,
  'details_optimizations': true,
  'details_qol': true
};

function showToast(msg, kind) {
  var stack = document.getElementById('toastStack');
  if (!stack) return;
  var t = document.createElement('div');
  t.className = 'toast-item ' + (kind || '');
  t.textContent = String(msg);
  stack.appendChild(t);
  
  t.offsetWidth;
  t.classList.add('show');
  var ttl = kind === 'err' ? 5000 : 2500;
  setTimeout(function() {
    t.classList.remove('show');
    setTimeout(function() { if (t.parentNode) t.parentNode.removeChild(t); }, 260);
  }, ttl);
}

var NON_CONFIG_IDS = { profileName: 1, importCfgFile: 1, toggleSearch: 1 };
function readConfigFromDOM() {
  var config = {};
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    var cb = checkboxes[i];
    if (!cb.id || NON_CONFIG_IDS[cb.id]) continue;
    config[cb.id] = cb.checked;
  }
  var texts = document.querySelectorAll('input[type="text"]');
  for (var j = 0; j < texts.length; j++) {
    var ti = texts[j];
    if (!ti.id || NON_CONFIG_IDS[ti.id]) continue;
    config[ti.id] = ti.value;
  }
  var sel = document.getElementById('gameVersion');
  if (sel) config.gameVersion = sel.value;
  
  var fPreset = document.getElementById('faviconPreset');
  if (fPreset) config.faviconPreset = fPreset.value;
  
  var detailsEls = document.querySelectorAll('details[data-cfg-id]');
  for (var d = 0; d < detailsEls.length; d++) {
    var key = 'details_' + detailsEls[d].getAttribute('data-cfg-id');
    config[key] = detailsEls[d].open;
  }
  
  var themeEl = document.querySelector('.theme-dot.active');
  if (themeEl) config.theme = themeEl.getAttribute('data-theme-val');
  config._schema = 2;
  return config;
}

function applyConfigToDOM(config) {
  
  var hasOwn = Object.prototype.hasOwnProperty;
  var checkboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < checkboxes.length; i++) {
    var cb = checkboxes[i];
    if (hasOwn.call(config, cb.id)) cb.checked = !!config[cb.id];
  }
  var texts = document.querySelectorAll('input[type="text"]');
  for (var j = 0; j < texts.length; j++) {
    var ti = texts[j];
    if (hasOwn.call(config, ti.id) && typeof config[ti.id] === 'string') ti.value = config[ti.id];
  }
  var sel = document.getElementById('gameVersion');
  if (sel && config.gameVersion) sel.value = config.gameVersion;
  
  var fPreset = document.getElementById('faviconPreset');
  if (fPreset && hasOwn.call(config, 'faviconPreset')) fPreset.value = config.faviconPreset;
  var detailsEls = document.querySelectorAll('details[data-cfg-id]');
  for (var d = 0; d < detailsEls.length; d++) {
    var key = 'details_' + detailsEls[d].getAttribute('data-cfg-id');
    if (hasOwn.call(config, key)) detailsEls[d].open = !!config[key];
  }
  
  if (config.theme) applyTheme(config.theme);
}

function saveConfig() {
  try {
    var config = readConfigFromDOM();
    try {
      safeSet(CONFIG_KEY, JSON.stringify(config));
      showToast('Configuration saved');
      logActivity('Config saved', 'ok');
    } catch (e) {
      if (e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014)) {
        showToast('Save failed: storage quota exceeded. Resetting to free space.');
        try {
          safeRemove(CONFIG_KEY);
          safeSet(CONFIG_KEY, JSON.stringify(config));
          showToast('Configuration saved (after cleanup)');
          logActivity('Config saved (after cleanup)', 'ok');
        } catch (e2) {
          showToast('Save failed: storage unavailable');
          logActivity('Save failed: ' + e2.message, 'err');
        }
      } else {
        showToast('Save failed: ' + (e.message || e.name || 'unknown error'));
        logActivity('Save failed: ' + e.message, 'err');
      }
    }
  } catch(e) {
    showToast('Save failed: ' + e.message);
  }
}

function loadConfig() {
  try {
    var raw = safeGet(CONFIG_KEY, null);
    if (!raw) return false;
    var config;
    try { config = JSON.parse(raw); }
    catch(parseErr) {
      
      var ts = Date.now();
      try { safeSet(CONFIG_KEY + '_corrupt_' + ts, raw); } catch(_) {}
      try { safeRemove(CONFIG_KEY); } catch(_) {}
      showToast('Saved config was corrupted — backed up, defaults restored.', 'err');
      logActivity('Config corruption detected; backed up and reset', 'err');
      return false;
    }
    
    if (!config._schema || config._schema < 2) {
      var hasOwn = Object.prototype.hasOwnProperty;
      for (var k in DEFAULTS) {
        if (!hasOwn.call(DEFAULTS, k)) continue;
        if (!hasOwn.call(config, k)) config[k] = DEFAULTS[k];
      }
      config._schema = 2;
      try { safeSet(CONFIG_KEY, JSON.stringify(config)); } catch(_) {}
      logActivity('Config schema migrated to v2', 'load');
    }
    applyConfigToDOM(config);
    return true;
  } catch(e) {
    return false;
  }
}

function resetConfig() {
  
  var modal = document.getElementById('resetModal');
  if (modal) modal.className = 'modal-overlay';
  else _doReset();
}
function _doReset() {
  try {
    safeRemove(CONFIG_KEY);
    for (var key in DEFAULTS) {
      if (!Object.prototype.hasOwnProperty.call(DEFAULTS, key)) continue;
      
      if (key.indexOf('details_') === 0) continue;
      if (key === 'theme') { applyTheme(DEFAULTS.theme); continue; }
      var el = document.getElementById(key);
      if (!el) continue;
      if (el.type === 'checkbox') el.checked = DEFAULTS[key];
      else el.value = DEFAULTS[key];
    }
    var detailsEls = document.querySelectorAll('details[data-cfg-id]');
    for (var d = 0; d < detailsEls.length; d++) detailsEls[d].open = true;
    showToast('Reset to defaults');
    logActivity('Config reset to defaults', 'load');
  } catch(e) {
    showToast('Reset failed: ' + e.message);
  }
}

var loaded = loadConfig();
if (!loaded) applyTheme('dark');

renderTimeline();

var saveTimer = null;
var _lastSavedConfig = (function() {
  try { return safeGet(CONFIG_KEY, null); } catch(_) { return null; }
})();
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(function() {
    saveTimer = null;
    try {
      var serialized = JSON.stringify(readConfigFromDOM());
      if (_lastSavedConfig === serialized) return;
      _lastSavedConfig = serialized;
      safeSet(CONFIG_KEY, serialized);
    } catch(e) {}
  }, 500);
}
try {
  var allInputs = document.querySelectorAll('input[type="checkbox"], input[type="text"], select');
  for (var i = 0; i < allInputs.length; i++) {
    allInputs[i].addEventListener('change', scheduleSave);
    if (allInputs[i].type === 'text') {
      allInputs[i].addEventListener('input', scheduleSave);
    }
  }
} catch(_) {}

try { window.__eaglerliteBindClick('saveCfgBtn', saveConfig); } catch(_) {}
try { window.__eaglerliteBindClick('resetCfgBtn', resetConfig); } catch(_) {}
try { window.__eaglerliteBindClick('resetCancelBtn', function() {
  var m = document.getElementById('resetModal');
  if (m) m.className = 'modal-overlay hidden';
}); } catch(_) {}
try { window.__eaglerliteBindClick('resetConfirmBtn', function() {
  var m = document.getElementById('resetModal');
  if (m) m.className = 'modal-overlay hidden';
  _doReset();
}); } catch(_) {}

try { document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' || e.keyCode === 27) {
    var modal = document.getElementById('resetModal');
    if (modal && !modal.classList.contains('hidden')) {
      modal.className = 'modal-overlay hidden';
    }
  }
}); } catch(_) {}

function applyTheme(theme) {
  var valid = { dark:1, light:1, midnight:1, terminal:1 };
  if (!valid[theme]) theme = 'dark';
  if (typeof window.__eaglerliteApplyThemeVars === 'function') {
    try { window.__eaglerliteApplyThemeVars(theme); } catch(_) {
      document.documentElement.setAttribute('data-theme', theme);
    }
  } else {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      var dv = { '--bg': '#000000', '--surf': '#0d0d0d', '--surf2': '#1a1a1a', '--border': '#ffffff', '--text': '#ffffff', '--muted': '#888888', '--accent': '#ffffff', '--ok': '#7ee48c', '--load': '#f3d77a', '--err': '#ff6b6b', '--sw-on': '#ffffff', '--sw-on-knob': '#000000', '--sw-off-knob': '#888888', '--shadow': '0 2px 12px rgba(0,0,0,0.4)', '--banner-grad': 'linear-gradient(135deg,#5b8eff,#9b6dff)' };
      var dvs = document.documentElement.style;
      for (var dk in dv) { if (!Object.prototype.hasOwnProperty.call(dv, dk)) continue; try { dvs.setProperty(dk, dv[dk]); } catch(_) {} }
    } catch(_) {}
  }
  var dots = document.querySelectorAll('.theme-dot');
  for (var i = 0; i < dots.length; i++) {
    if (dots[i].getAttribute('data-theme-val') === theme) dots[i].classList.add('active');
    else dots[i].classList.remove('active');
  }
  try { safeSet('eaglerLiteTheme_v2', theme); } catch(_) {}
}
(function() {
  try {
    var saved = safeGet('eaglerLiteTheme_v2', 'dark') || 'dark';
    applyTheme(saved);
  } catch(_) { applyTheme('dark'); }
})();
try { window.__eaglerliteBindEvent('themeSwitcher', 'click', function(e) {
  if (!e || !e.target || !e.target.closest) return;
  var t = e.target.closest('.theme-dot');
  if (!t) return;
  var v = t.getAttribute('data-theme-val');
  applyTheme(v);
  scheduleSave();
}); } catch(_) {}

var PROFILES_KEY = 'eaglerLiteProfiles_v2';
function loadProfiles() {
  try { return JSON.parse(safeGet(PROFILES_KEY, '{}') || '{}'); }
  catch(_) { return {}; }
}
function saveProfiles(obj) {
  try { safeSet(PROFILES_KEY, JSON.stringify(obj)); } catch(_) {}
}
function refreshProfileSelect() {
  var sel = document.getElementById('profileSelect');
  if (!sel) return;
  var profiles = loadProfiles();
  var names = Object.keys(profiles).sort();
  var cur = sel.value;
  sel.innerHTML = '<option value="">-- Choose a profile --</option>';
  for (var i = 0; i < names.length; i++) {
    var o = document.createElement('option');
    o.value = names[i];
    o.textContent = names[i];
    if (names[i] === cur) o.selected = true;
    sel.appendChild(o);
  }
}
try { window.__eaglerliteBindClick('saveProfileBtn', function() {
  var pNameEl = document.getElementById('profileName');
  var name = pNameEl ? ((pNameEl.value || '').trim()) : '';
  if (!name) { showToast('Enter a profile name first'); return; }
  var profiles = loadProfiles();
  profiles[name] = readConfigFromDOM();
  saveProfiles(profiles);
  refreshProfileSelect();
  var pSelEl = document.getElementById('profileSelect');
  if (pSelEl) pSelEl.value = name;
  showToast('Profile "' + name + '" saved');
  logActivity('Profile saved: ' + name, 'ok');
}); } catch(_) {}
try { window.__eaglerliteBindClick('loadProfileBtn', function() {
  var selEl = document.getElementById('profileSelect');
  if (!selEl) { showToast('Profile selector unavailable - reload the page'); return; }
  var name = selEl.value;
  if (!name) { showToast('Choose a profile first'); return; }
  var profiles = loadProfiles();
  if (!profiles[name]) { showToast('Profile not found'); return; }
  applyConfigToDOM(profiles[name]);
  scheduleSave();
  showToast('Profile "' + name + '" loaded');
  logActivity('Profile loaded: ' + name, 'ok');
}); } catch(_) {}
try { window.__eaglerliteBindClick('deleteProfileBtn', function() {
  var selEl = document.getElementById('profileSelect');
  if (!selEl) { showToast('Profile selector unavailable - reload the page'); return; }
  var name = selEl.value;
  if (!name) { showToast('Choose a profile first'); return; }
  if (!confirm('Delete profile "' + name + '"?')) return;
  var profiles = loadProfiles();
  delete profiles[name];
  saveProfiles(profiles);
  refreshProfileSelect();
  showToast('Profile "' + name + '" deleted');
  logActivity('Profile deleted: ' + name, 'load');
}); } catch(_) {}
refreshProfileSelect();

try { window.__eaglerliteBindClick('exportCfgBtn', function() {
  var config = readConfigFromDOM();
  var json = JSON.stringify(config, null, 2);
  var blob = new Blob([json], { type: 'application/json' });
  var url = URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = 'eaglerlite-config.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function() { URL.revokeObjectURL(url); }, 100);
  showToast('Config exported');
  logActivity('Config exported as JSON', 'ok');
}); } catch(_) {}
try { window.__eaglerliteBindClick('importCfgBtn', function() {
  var impEl = document.getElementById('importCfgFile');
  if (impEl) impEl.click();
}); } catch(_) {}
try { window.__eaglerliteBindEvent('importCfgFile', 'change', function(e) {
  var file = e.target.files && e.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function() {
    try {
      var config = JSON.parse(reader.result);
      applyConfigToDOM(config);
      scheduleSave();
      showToast('Config imported');
      logActivity('Config imported from JSON', 'ok');
    } catch(err) {
      showToast('Import failed: ' + err.message);
      logActivity('Import failed: ' + err.message, 'err');
    }
  };
  reader.readAsText(file);
  try { e.target.value = ''; } catch(_) {}
}); } catch(_) {}

try { document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
    
    var modal = document.getElementById('resetModal');
    if (modal && !modal.classList.contains('hidden')) return;
    if (typeof panicCapturing !== 'undefined' && panicCapturing) return;
    e.preventDefault();
    if (typeof launchGame === 'function') launchGame();
  }
}); } catch(_) {}

try { window.__eaglerliteBindClick('copyAutolaunchBtn', function() {
  try {
    var cfg = readConfigFromDOM();
    var json = JSON.stringify(cfg);
    var b64 = b64EncodeUnicode(json);
    var url = window.location.origin + window.location.pathname + '?autoLaunch=1&cfg=' + b64;
    var input = document.createElement('textarea');
    input.value = url;
    input.style.position = 'fixed';
    input.style.top = '-1000px';
    document.body.appendChild(input);
    input.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch(_) { ok = false; }
    if (!ok) {
      try { navigator.clipboard.writeText(url); ok = true; } catch(_) {}
    }
    document.body.removeChild(input);
    if (ok) {
      showToast('Launch URL copied to clipboard');
      logActivity('Launch URL copied', 'ok');
    } else {
      showToast('Copy failed - clipboard unavailable');
    }
  } catch(err) {
    showToast('Copy failed: ' + err.message);
    logActivity('Copy URL failed: ' + err.message, 'err');
  }
}); } catch(_) {}

var panicCapturing = false;
try { window.__eaglerliteBindClick('panicTestBtn', function() {
  panicCapturing = true;
  var kbd = document.getElementById('panicTestKbd');
  if (kbd) kbd.textContent = 'Press any key\u2026';
  if (kbd) kbd.style.background = 'var(--load)';
}); } catch(_) {}
try { document.addEventListener('keydown', function(e) {
  if (!panicCapturing) return;
  e.preventDefault();
  e.stopPropagation();
  panicCapturing = false;
  var kbd = document.getElementById('panicTestKbd');
  var code = e.code || e.key;
  if (kbd) kbd.textContent = code;
  if (kbd) kbd.style.background = '';
  var pkEl = document.getElementById('panicKey');
  if (pkEl) pkEl.value = code;
  scheduleSave();
  showToast('Panic key set to: ' + code);
}, true); } catch(_) {}

(function() {
  try {
    var dismissedAt = +safeGet('eaglerLiteBannerDismissed_v2', '0') || 0;
    var sevenDays = 7 * 24 * 60 * 60 * 1000;
    if (dismissedAt && (Date.now() - dismissedAt) < sevenDays) {
      var b = document.getElementById('eaglerNodesBanner');
      if (b) b.style.display = 'none';
    }
  } catch(_) {}
})();
try { window.__eaglerliteBindClick('bannerDismiss', function(e) {
  try { e.preventDefault(); } catch(_) {}
  try { e.stopPropagation(); } catch(_) {}
  var b = document.getElementById('eaglerNodesBanner');
  if (b) b.style.display = 'none';
  try { safeSet('eaglerLiteBannerDismissed_v2', String(Date.now())); } catch(_) {}
  showToast('Banner dismissed for 7 days');
}); } catch(_) {}

(function() {
  try {
    var ind = document.getElementById('autoModeIndicator');
    if (!ind) return;
    if (detectSandbox()) {
      ind.textContent = 'Mode: sandbox (iframe embed fallback ready)';
      ind.style.color = 'var(--load)';
    } else {
      ind.textContent = 'Mode: standard';
    }
  } catch(_) {}
})();

function toggleKbdOverlay() {
  var o = document.getElementById('kbdOverlay');
  if (!o) return;
  o.classList.toggle('hidden');
}
try { window.__eaglerliteBindClick('kbdCloseBtn', toggleKbdOverlay); } catch(_) {}
try { window.__eaglerliteBindEvent('kbdOverlay', 'click', function(e) {
  if (e.target === this) toggleKbdOverlay();
}); } catch(_) {}

(function() {
  var search = document.getElementById('toggleSearch');
  if (!search) return;
  function filter() {
    var q = search.value.trim().toLowerCase();
    var togs = document.querySelectorAll('.tog');
    for (var i = 0; i < togs.length; i++) {
      if (!q) { togs[i].classList.remove('hidden-by-search'); continue; }
      var title = togs[i].querySelector('.tog-title');
      var desc  = togs[i].querySelector('.tog-desc');
      var txt = ((title ? title.textContent : '') + ' ' + (desc ? desc.textContent : '')).toLowerCase();
      if (txt.indexOf(q) !== -1) togs[i].classList.remove('hidden-by-search');
      else togs[i].classList.add('hidden-by-search');
    }
  }
  search.addEventListener('input', filter);
  search.addEventListener('change', filter);
})();

var HISTORY_KEY = 'eaglerLiteLaunchHistory_v2';
function loadHistory() {
  try { return JSON.parse(safeGet(HISTORY_KEY, '[]') || '[]'); }
  catch(_) { return []; }
}
function saveHistory(arr) {
  try { safeSet(HISTORY_KEY, JSON.stringify(arr.slice(-10))); }
  catch(_) {}
}
function pushHistory(method, kind, note) {
  var arr = loadHistory();
  arr.push({ t: Date.now(), method: method || 'unknown', kind: kind || 'load', note: (note || '').slice(0,80) });
  saveHistory(arr);
  renderHistory();
}
function renderHistory() {
  var panel = document.getElementById('historyPanel');
  if (!panel) return;
  var arr = loadHistory();
  if (!arr.length) {
    panel.innerHTML = '<div class="history-empty">No launches yet &mdash; your last 5 launches will appear here.</div>';
    return;
  }
  panel.innerHTML = '';
  var recent = arr.slice(-5).reverse();
  for (var i = 0; i < recent.length; i++) {
    var e = recent[i];
    var time = new Date(e.t).toLocaleTimeString();
    var row = document.createElement('div');
    row.className = 'history-entry';
    row.innerHTML =
      '<span class="history-time">' + escapeHtml(time) + '</span>' +
      '<span class="history-method">' + escapeHtml(e.method) + '</span>' +
      '<span class="history-result ' + escapeHtml(e.kind) + '">' +
        (e.kind === 'ok' ? 'OK' : (e.kind === 'err' ? 'FAIL' : 'PENDING')) +
      '</span>';
    panel.appendChild(row);
  }
}

try { document.addEventListener('keydown', function(e) {
  var tag = (e.target && e.target.tagName) ? e.target.tagName.toUpperCase() : '';
  var isField = (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA');
  
  if (e.key === 'Escape' || e.keyCode === 27) {
    var kbdO = document.getElementById('kbdOverlay');
    if (kbdO && !kbdO.classList.contains('hidden')) { kbdO.classList.add('hidden'); return; }
  }
  if (isField) return;
  if (e.key === '?' || (e.shiftKey && e.key === '/')) {
    e.preventDefault(); toggleKbdOverlay(); return;
  }
  if (e.key === '/') {
    e.preventDefault();
    var ts = document.getElementById('toggleSearch');
    if (ts) ts.focus();
    return;
  }
  if (e.ctrlKey || e.metaKey) return;
  if (e.key === 's' || e.key === 'S') { e.preventDefault(); saveConfig(); return; }
  if (e.key === 'r' || e.key === 'R') { e.preventDefault(); resetConfig(); return; }
  if (e.key === 'd' || e.key === 'D') { e.preventDefault(); downloadLauncher(); return; }
}); } catch(_) {}

renderHistory();

function b64EncodeUnicode(str) {
  var bytes = new TextEncoder().encode(str);
  var bin = '';
  for (var i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  var b64 = btoa(bin);
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64DecodeUnicode(str) {
  var b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  var bin = atob(b64);
  var bytes = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(bytes);
}

(function () {
  try {
    var urlParams = new URLSearchParams(window.location.search);
    var autoLaunch = urlParams.get('autoLaunch');
    var cfgParam = urlParams.get('cfg');
    if (autoLaunch !== '1' || !cfgParam) return;

    var jsonStr = null;
    try { jsonStr = b64DecodeUnicode(cfgParam); } catch(e) { jsonStr = null; }
    if (!jsonStr) return;
    var cfg;
    try { cfg = JSON.parse(jsonStr); } catch (e) { return; }

    applyConfigToDOM(cfg);
    logActivity('AutoLaunch: config applied from URL', 'load');

    setTimeout(function () {
      try {
        if (typeof launchGame === 'function') launchGame();
        else { var btn = document.getElementById('launchBtn'); if (btn) btn.click(); }
      } catch (e) {
        try { console.error('[EaglerLite v2.1 AutoLaunch] Auto-launch error:', e); } catch (_) {}
        try { window.__eaglerliteReportError(e, 'autolaunch'); } catch(_) {}
      }
    }, 100);
  } catch (e) {
    try { console.error('[EaglerLite v2.1 AutoLaunch] Snippet error:', e); } catch (_) {}
  }
})();

try { _ensureReadyListener(); } catch(_) {}
