/* EaglerLite v2.1 KA Launcher JS - external CDN-loaded launcher for the KA iframe port.
   Loaded via <script src="https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-launcher.js">.
   Defensive bootstrap catches all sync/async errors (window.onerror + unhandledrejection with capture=true),
   detects CSP restrictions (localStorage, fetch CORS, same-origin), falls back to an in-memory Map store,
   surfaces failures via #status, #bootstrapError, #toastStack, and exposes window.__eaglerliteErrors /
   __eaglerliteCSP / __eaglerliteCDN for debugging. Hardened for reliability: try/catch around every critical
   path, 3-retry exponential-backoff proxy probe, force-cache-then-no-store source fetching with progress
   callback, iframe readiness handshake via postMessage, 60s launch watchdog that reveals the manual paste
   fallback on timeout, cleanup() that clears timers/listeners on close or relaunch, lazy warmup that defers
   network probes until first user interaction. Hard-codes gameVersion 1.12.2 and SRC_URL_112_FALLBACKS.
   Vanilla ES5-compatible. No inline comments below this block. */
'use strict';
(function() {
  'use strict';
  var _errs = window.__eaglerliteErrors = window.__eaglerliteErrors || [];
  var _csp = window.__eaglerliteCSP = window.__eaglerliteCSP || {
    localStorage: 'unknown', fetchCors: 'unknown', sameOrigin: 'unknown', cdn: 'unknown'
  };
  var _mem = (typeof Map !== 'undefined') ? new Map() : null;
  window.__eaglerliteMemStore = _mem;
  function _toast(msg, type) {
    try {
      if (typeof window.showToast === 'function') { window.showToast(msg, type); return; }
    } catch(_) {}
    try {
      var stack = document.getElementById('toastStack');
      if (!stack) { try { console.log('[EaglerLite toast]', msg); } catch(_) {} return; }
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
      try { console.error('[EaglerLite]', ctx || '', e); } catch(_) {}
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
    var probeUrl = 'https://cdn.jsdelivr.net/npm/eag-web-sp@1.0.4/classes1_mod.js';
    var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
    var timeout = setTimeout(function() { try { if (ctrl) ctrl.abort(); } catch(_) {} }, 8000);
    fetch(probeUrl, { method: 'HEAD', mode: 'cors', signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
      .then(function(r) {
        clearTimeout(timeout);
        _csp.fetchCors = (r && r.ok) ? 'ok' : 'http_' + (r ? r.status : 0);
      })
      .catch(function(err) {
        clearTimeout(timeout);
        var name = (err && err.name) || '';
        if (name === 'AbortError') _csp.fetchCors = 'timeout';
        else _csp.fetchCors = 'blocked';
        _report(new Error('CORS fetch probe failed (' + name + ') - runtime may not be loadable'), 'csp.fetch');
      });
  } catch(_) {
    _csp.fetchCors = 'no-fetch';
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
      else { try { console.log('[EaglerLite] Error report:', json); } catch(_) {} _toast('Copy failed - see console', 'err'); }
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

var SRC_URL_112_FALLBACKS = [
  'https://cdn.jsdelivr.net/gh/PlanetDogeCodes/EaglerLite@main/source%20file/egc1-12.xml',
  'https://raw.githubusercontent.com/PlanetDogeCodes/EaglerLite/main/source%20file/egc1-12.xml',
  'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://cdn.jsdelivr.net/gh/PlanetDogeCodes/EaglerLite@main/source%20file/egc1-12.xml')
];
var SRC_URL_112 = SRC_URL_112_FALLBACKS[0];
var SRC_URL_121 = 'https://eaglerlite1-21-11.netlify.app/';

var _warmupDone = false;
function _doLazyWarmup() {
  if (_warmupDone) return;
  _warmupDone = true;
  try { probeProxyHealth(); } catch(_) {}
}
try {
  document.addEventListener('click', _doLazyWarmup, { once: true });
  document.addEventListener('keydown', _doLazyWarmup, { once: true });
  document.addEventListener('touchstart', _doLazyWarmup, { once: true });
} catch(_) {}

function setStatus(msg, cls) {
  var el = document.getElementById('status');
  el.textContent = msg;
  el.className = cls || '';
  pushTimeline(msg, cls);
}
function setProgress(v) {
  document.getElementById('prog-fill').style.width = Math.round(Math.max(0, Math.min(1, v)) * 100) + '%';
}
function setBusy(on) {
  var btn = document.getElementById('launchBtn');
  btn.disabled = on;
  btn.textContent = on ? 'Loading…' : 'Launch Game';
}

function decodeBlob(blob) {
  return new Promise(function(res, rej) {
    var fr = new FileReader();
    fr.onload = function() {
      var s = fr.result || '';
      
      if (s.charCodeAt(0) === 0xFEFF) s = s.substring(1);
      res(s);
    };
    fr.onerror = function() { rej(fr.error); };
    try { fr.readAsText(blob, 'utf-8'); }
    catch(_) { fr.readAsText(blob); }
  });
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
  try { console.log('[EaglerLite ' + (kind || 'info').toUpperCase() + ']', msg); } catch(_) {}
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
    var cHl = cloneRoot.querySelector('#healthLabel');
    if (cHl) cHl.textContent = 'Proxy: checking\u2026';
    var cHd = cloneRoot.querySelector('#healthDot');
    if (cHd) cHd.className = 'health-dot';
    var cEmbed = cloneRoot.querySelector('#gameEmbed');
    if (cEmbed) cEmbed.className = 'hidden';
    var cEmbedBar = cloneRoot.querySelector('#embedCloseBar');
    if (cEmbedBar) cEmbedBar.className = 'hidden';
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

function probeProxyHealth() {
  try {
    var dot = document.getElementById('healthDot');
    var label = document.getElementById('healthLabel');
    if (!dot || !label) return;
    try {
      if (window.__eaglerliteCSP && (window.__eaglerliteCSP.fetchCors === 'blocked' || window.__eaglerliteCSP.fetchCors === 'no-fetch')) {
        dot.className = 'health-dot load';
        label.textContent = 'Proxy: skipped (CSP)';
        try { window.__eaglerliteCSP.proxy = 'skipped'; } catch(_) {}
        return;
      }
    } catch(_) {}
    dot.className = 'health-dot load';
    label.textContent = 'Proxy: checking\u2026';
    var proxyUrl = 'wss://eaglerlite-proxy.onrender.com/';
    try {
      var wsEl = document.getElementById('wsProxyUrl');
      if (wsEl && wsEl.value) proxyUrl = wsEl.value.trim() || proxyUrl;
    } catch(_) {}
    var httpsUrl = proxyUrl.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:');
    httpsUrl = httpsUrl.replace(/\/$/, '') + '/health';
    var attempt = 0;
    var MAX_ATTEMPTS = 4;
    var BACKOFFS = [250, 750, 2000];
    function doAttempt() {
      attempt++;
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var perTimeout = setTimeout(function() { try { if (ctrl) ctrl.abort(); } catch(_) {} }, 5000);
      function onFail(kind) {
        if (attempt < MAX_ATTEMPTS) {
          var delay = BACKOFFS[attempt - 1] || 2000;
          setTimeout(doAttempt, delay);
          return;
        }
        dot.className = 'health-dot load';
        if (kind === 'timeout') label.textContent = 'Proxy: timeout (singleplayer OK)';
        else if (kind === 'http') label.textContent = 'Proxy: HTTP err (singleplayer OK)';
        else label.textContent = 'Proxy: unreachable (singleplayer OK)';
        try { window.__eaglerliteCSP.proxy = 'unreachable'; } catch(_) {}
      }
      try {
        fetch(httpsUrl, { method: 'GET', signal: ctrl ? ctrl.signal : undefined, cache: 'no-store' })
          .then(function(r) {
            clearTimeout(perTimeout);
            if (r.ok) {
              dot.className = 'health-dot ok';
              label.textContent = 'Proxy: \u2713 healthy';
              try { window.__eaglerliteCSP.proxy = 'ok'; } catch(_) {}
              return;
            }
            onFail('http');
          })
          .catch(function(err) {
            clearTimeout(perTimeout);
            var name = (err && err.name) || '';
            if (name === 'AbortError') onFail('timeout');
            else onFail('unreachable');
          });
      } catch(fetchErr) {
        clearTimeout(perTimeout);
        onFail('unreachable');
      }
    }
    doAttempt();
  } catch(outerErr) {
    try {
      var dot2 = document.getElementById('healthDot');
      var label2 = document.getElementById('healthLabel');
      if (dot2) dot2.className = 'health-dot load';
      if (label2) label2.textContent = 'Proxy: unreachable (singleplayer OK)';
    } catch(_) {}
    try { window.__eaglerliteReportError(outerErr, 'probeProxyHealth'); } catch(_) {}
  }
}

var RUNTIME_URLS = [
  'https://cdn.jsdelivr.net/npm/eag-web-sp@1.0.4/classes1_mod.js',
  'https://unpkg.com/eag-web-sp@1.0.4/classes1_mod.js'
];
var ASSETS_URLS = [
  'https://cdn.jsdelivr.net/npm/eag-web-sp@1.0.4/assets_uri.js',
  'https://unpkg.com/eag-web-sp@1.0.4/assets_uri.js'
];

function buildKASrcdoc(cfg, opts) {
  opts = opts || {};
  var stripReferrer = opts.stripReferrer !== false;
  var refMeta = stripReferrer ? '<meta name="referrer" content="no-referrer">\n' : '';
  var cfgJson = JSON.stringify(cfg).replace(/<\/script>/gi, '<\\/script>');
  var runtimeList = '["' + RUNTIME_URLS.join('","') + '"]';
  var assetsList = '["' + ASSETS_URLS.join('","') + '"]';
  if (opts.fallback) {
    return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Launch failed</title></head>' +
      '<body style="background:#000;color:#eee;font:14px monospace;padding:24px">' +
      '<h2>EaglerLite launch failed</h2>' +
      '<p>Check the launcher toast or error report for details.</p>' +
      '<p>If your network blocks the Eaglercraft runtime CDN, try the manual paste fallback.</p>' +
      '</body></html>';
  }
  var parts = [
    '<!DOCTYPE html>\n',
    '<html>\n<head>\n',
    '<title>Spin-off of "Eaglercraft Singleplayer Test"</title>\n',
    '<meta charset="UTF-8">\n',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
    refMeta,
    '<style>html,body{margin:0;padding:0;width:100vw;height:100vh;overflow:hidden;background:#000}#toastStack{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);z-index:100000001;display:flex;flex-direction:column-reverse;gap:4px;pointer-events:none;max-width:90vw}.toast-item{background:#222;color:#eee;padding:6px 12px;border-radius:6px;font:13px monospace;opacity:0;transition:opacity .2s;max-width:90vw}.toast-item.show{opacity:1}.toast-item.err{background:#400;border:1px solid #f55}.toast-item.ok{background:#040;border:1px solid #5f5}</style>\n',
    '</head>\n',
    '<body id="game_frame">\n',
    '<div id="toastStack"></div>\n',
    '<scr' + 'ipt>\n',
    '(function(){\n',
    '  function toast(m,k){var s=document.getElementById("toastStack");if(!s){try{console.log("[KA]",m);}catch(_){}return;}var t=document.createElement("div");t.className="toast-item "+(k||"");t.textContent=String(m);s.appendChild(t);try{requestAnimationFrame(function(){t.classList.add("show")});}catch(_){t.classList.add("show");}setTimeout(function(){t.classList.remove("show");setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},300)},k==="err"?6000:3000)}\n',
    '  var RUNTIME_URLS=' + runtimeList + ';\n',
    '  var ASSETS_URLS=' + assetsList + ';\n',
    '  var runtimeLoaded=false, assetsLoaded=false, launchAttempted=false;\n',
    '  function loadScript(urls, idx, onLoaded, onAllFailed){\n',
    '    if (idx>=urls.length){onAllFailed();return;}\n',
    '    var s=document.createElement("script");\n',
    '    s.src=urls[idx];\n',
    '    s.async=false;\n',
    '    s.onload=function(){onLoaded(urls[idx]);};\n',
    '    s.onerror=function(){\n',
    '      toast("Failed to load: "+urls[idx]+" - trying next","err");\n',
    '      if (s.parentNode) s.parentNode.removeChild(s);\n',
    '      loadScript(urls, idx+1, onLoaded, onAllFailed);\n',
    '    };\n',
    '    document.head.appendChild(s);\n',
    '  }\n',
    '  function decodeAssets(){\n',
    '    try {\n',
    '      if (!window.assetsUri) { toast("assets_uri.js failed to load","err"); return false; }\n',
    '      var raw = window.assetsUri || "";\n',
    '      var marker = ";base64,";\n',
    '      var idx = raw.indexOf(marker);\n',
    '      if (idx >= 0) raw = raw.slice(idx + marker.length);\n',
    '      var bin = window.atob(raw);\n',
    '      var bytes = new Uint8Array(bin.length);\n',
    '      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);\n',
    '      window.assetsData = bytes;\n',
    '      return true;\n',
    '    } catch(e) { toast("asset decode failed: "+e.message,"err"); return false; }\n',
    '  }\n',
    '  function tryLaunch(){\n',
    '    if (launchAttempted) return;\n',
    '    if (!runtimeLoaded || !assetsLoaded) return;\n',
    '    launchAttempted=true;\n',
    '    if (!decodeAssets()) return;\n',
    '    try {\n',
    '      window.minecraftOpts = ["game_frame", ""];\n',
    '      if (typeof main === "function") {\n',
    '        main();\n',
    '        toast("launched","ok");\n',
    '        try { window.eaglercraftXOpts = window.eaglercraftXOpts || {}; } catch(_) {}\n',
    '        try { if (window.parent && typeof window.parent.postMessage === "function") { window.parent.postMessage({eaglerliteReady:true, version:"1.12.2", source:"ka-srcdoc"}, "*"); } } catch(_) {}\n',
    '      } else {\n',
    '        toast("main() not found - runtime did not load","err");\n',
    '        try { if (window.parent && typeof window.parent.postMessage === "function") { window.parent.postMessage({eaglerliteReady:false, error:"main not found", source:"ka-srcdoc"}, "*"); } } catch(_) {}\n',
    '      }\n',
    '    } catch(e) {\n',
    '      toast("launch failed: "+e.message,"err");\n',
    '      try { if (window.parent && typeof window.parent.postMessage === "function") { window.parent.postMessage({eaglerliteReady:false, error:String(e.message||e), source:"ka-srcdoc"}, "*"); } } catch(_) {}\n',
    '    }\n',
    '  }\n',
    '  loadScript(RUNTIME_URLS, 0, function(u){runtimeLoaded=true; try{console.log("[KA] runtime loaded:",u);}catch(_){}; tryLaunch();}, function(){toast("All runtime URLs failed - game cannot launch. Use manual paste fallback.","err");});\n',
    '  loadScript(ASSETS_URLS, 0, function(u){assetsLoaded=true; try{console.log("[KA] assets loaded:",u);}catch(_){}; tryLaunch();}, function(){toast("All assets URLs failed - game cannot launch. Use manual paste fallback.","err");});\n',
    '  try { window.eaglerLiteCfg = ' + cfgJson + '; } catch(e) {}\n',
    '})();\n',
    '</scr' + 'ipt>\n',
    '</body>\n</html>\n'
  ];
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
    try { window.__eaglerliteToast('Network fetch failed - paste Eaglercraft source XML below as fallback', 'err'); } catch(_) {}
  } catch(_) {}
}
function fetchSourceWithFallbacks(onSuccess, onFailure, onProgress) {
  var urls = SRC_URL_112_FALLBACKS.slice();
  var idx = 0;
  var totalAttempts = urls.length * 2;
  var attemptNum = 0;
  function reportProgress(url) {
    attemptNum++;
    try {
      if (typeof onProgress === 'function') {
        try { onProgress(attemptNum, totalAttempts, url); } catch(_) {}
      } else {
        try { setProgress(0.1 + (attemptNum / totalAttempts) * 0.6); } catch(_) {}
        try { setStatus('Trying CDN ' + attemptNum + '/' + totalAttempts + '...', 'load'); } catch(_) {}
      }
    } catch(_) {}
  }
  function tryNext() {
    if (idx >= urls.length) {
      try { window.__eaglerliteToast('All source XML fetches failed - use manual paste fallback', 'err'); } catch(_) {}
      try { _revealManualPaste(); } catch(_) {}
      if (typeof onFailure === 'function') onFailure(new Error('All source XML URLs failed'));
      return;
    }
    var url = urls[idx];
    idx++;
    reportProgress(url);
    function doFetch(cMode) {
      if (cMode === 'no-store') { attemptNum++; try { if (typeof onProgress === 'function') { try { onProgress(attemptNum, totalAttempts, url); } catch(_) {} } else { try { setProgress(0.1 + (attemptNum / totalAttempts) * 0.6); } catch(_) {} try { setStatus('Retrying (no-cache) CDN ' + attemptNum + '/' + totalAttempts + '...', 'load'); } catch(_) {} } } catch(_) {} }
      var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
      var timedOut = false;
      var t = setTimeout(function() {
        timedOut = true;
        try { if (ctrl) ctrl.abort(); } catch(_) {}
      }, 30000);
      try {
        fetch(url, { signal: ctrl ? ctrl.signal : undefined, cache: cMode })
          .then(function(r) {
            clearTimeout(t);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            return r.text();
          })
          .then(function(text) {
            clearTimeout(t);
            if (typeof onSuccess === 'function') onSuccess(text, url);
          })
          .catch(function(err) {
            clearTimeout(t);
            if (cMode === 'force-cache') {
              try { doFetch('no-store'); } catch(_) { tryNext(); }
              return;
            }
            if (timedOut) {
              try { window.__eaglerliteToast('Fetch timed out (30s): ' + url, 'err'); } catch(_) {}
            } else {
              try { window.__eaglerliteToast('Fetch failed: ' + url + ' (' + (err && err.message || err) + ')', 'err'); } catch(_) {}
            }
            tryNext();
          });
      } catch(fetchErr) {
        clearTimeout(t);
        if (cMode === 'force-cache') {
          try { doFetch('no-store'); } catch(_) { tryNext(); }
          return;
        }
        try { window.__eaglerliteToast('fetch() unavailable: ' + (fetchErr && fetchErr.message), 'err'); } catch(_) {}
        tryNext();
      }
    }
    doFetch('force-cache');
  }
  tryNext();
}
window.__eaglerliteFetchSource = fetchSourceWithFallbacks;

function cleanup() {
  try { if (_launchTimeout) { clearTimeout(_launchTimeout); _launchTimeout = null; } } catch(_) {}
  try { stopTitleCycle(); } catch(_) {}
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
function _ensureReadyListener() {
  if (_readyListener) return;
  _readyListener = function(ev) {
    try {
      var data = ev && ev.data;
      if (!data || typeof data !== 'object') return;
      if (data.source !== 'ka-srcdoc') return;
      if (data.eaglerliteReady === true) {
        if (_launchTimeout) { try { clearTimeout(_launchTimeout); } catch(_) {} _launchTimeout = null; }
        _launching = false;
        try { setBusy(false); } catch(_) {}
        try { _setLaunchState('launched', 'Launched 1.12.2!', 'ok'); } catch(_) {}
        try { setProgress(1); } catch(_) {}
        try { logActivity('Eaglercraft 1.12.2 runtime ready', 'ok'); } catch(_) {}
        try { pushHistory('runtime-ready', 'ok', '1.12.2'); } catch(_) {}
      } else if (data.eaglerliteReady === false) {
        if (_launchTimeout) { try { clearTimeout(_launchTimeout); } catch(_) {} _launchTimeout = null; }
        _launching = false;
        try { setBusy(false); } catch(_) {}
        var errMsg = data.error || 'runtime did not signal readiness';
        try { _setLaunchState('runtime-failed', 'Runtime failed: ' + errMsg + ' - try the manual paste fallback', 'err'); } catch(_) {}
        try { window.__eaglerliteReportError(new Error('Runtime failed: ' + errMsg), 'launchGame.runtimeFailed'); } catch(_) {}
        try { logActivity('Runtime failed: ' + errMsg, 'err'); } catch(_) {}
        try { pushHistory('runtime-failed', 'err', String(errMsg).slice(0, 80)); } catch(_) {}
        try { _revealManualPaste(); } catch(_) {}
      }
    } catch(_) {}
  };
  try { window.addEventListener('message', _readyListener, false); } catch(_) {}
}

function launchGame(pastedXml) {
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
      _setLaunchState('timeout', 'Launch timed out (60s no readiness signal) - try the manual paste fallback.', 'err');
      try { window.__eaglerliteReportError(new Error('Launch timed out (60s no readiness signal)'), 'launchGame.timeout'); } catch(_) {}
      try { logActivity('Launch timed out (60s no readiness signal)', 'err'); } catch(_) {}
      try { pushHistory('timeout', 'err', '60s no readiness signal'); } catch(_) {}
      try { _revealManualPaste(); } catch(_) {}
    }
  }, 60000);
  try {
    _setLaunchState('reading-config', 'Reading configuration...', 'load');
    var tabName = 'Eaglercraft';
    try { tabName = (document.getElementById('tabName').value.trim()) || 'Eaglercraft'; } catch(_) {}
    var sprintKey = 'ControlLeft';
    try { sprintKey = (document.getElementById('sprintKey').value.trim()) || 'ControlLeft'; } catch(_) {}
    var favicon = '';
    try { favicon = document.getElementById('favicon').value.trim(); } catch(_) {}
    var faviconPreset = 'custom';
    try { faviconPreset = (document.getElementById('faviconPreset') && document.getElementById('faviconPreset').value) || 'custom'; } catch(_) {}
    var stripReferrer = true;
    try { stripReferrer = document.getElementById('ch_stripReferrer') ? document.getElementById('ch_stripReferrer').checked : true; } catch(_) {}
    var titleCycle = false;
    try { titleCycle = document.getElementById('ch_titleCycle') ? document.getElementById('ch_titleCycle').checked : false; } catch(_) {}
    var titleCycleList = '';
    try { titleCycleList = (document.getElementById('titleCycleList') && document.getElementById('titleCycleList').value) || ''; } catch(_) {}
    var cfg = {};
    try {
      cfg = {
        p1: document.getElementById('ch1').checked, p3: document.getElementById('ch3').checked, p4: document.getElementById('ch4').checked,
        p5: document.getElementById('ch5').checked, p6: document.getElementById('ch6').checked, p7: document.getElementById('ch11').checked,
        p8: document.getElementById('ch12').checked, p9: document.getElementById('ch13').checked, p10: document.getElementById('ch14').checked,
        p11: document.getElementById('ch15').checked, p12: document.getElementById('ch16').checked, p13: document.getElementById('ch17').checked,
        p14: document.getElementById('ch18').checked, fullbright: document.getElementById('ch8').checked, autosprint: document.getElementById('ch9').checked,
        zoom: document.getElementById('ch10').checked, hud: document.getElementById('ch7').checked, sprintKeyAuto: document.getElementById('ch2').checked,
        crystalOptimizer: document.getElementById('ch19').checked, autoReconnect: document.getElementById('ch20').checked,
        fpsLimiter: document.getElementById('ch21').checked, tabName: tabName, sprintKey: sprintKey, favicon: favicon,
        panicLink: (document.getElementById('panicLink').value.trim()) || 'https://classroom.google.com',
        panicKey: (document.getElementById('panicKey').value.trim()) || 'Equal', gameVersion: '1.12.2',
        wsProxyUrl: (document.getElementById('wsProxyUrl').value.trim()) || '',
        reconnectDelay: parseInt(document.getElementById('reconnectDelay').value.trim(), 10) || 2500,
        reconnectRetries: parseInt(document.getElementById('reconnectRetries').value.trim(), 10) || 1,
        maxFPS: parseInt(document.getElementById('maxFPS').value.trim(), 10) || 120
      };
    } catch(cfgErr) {
      try { window.__eaglerliteReportError(cfgErr, 'launchGame.readConfig'); } catch(_) {}
      throw cfgErr;
    }
    var warnings = _validateLaunchConfig(cfg);
    for (var wi = 0; wi < warnings.length; wi++) {
      try { window.__eaglerliteToast(warnings[wi], 'load'); } catch(_) {}
    }
    try { safeSet('eaglerLiteLastLaunch_v2', JSON.stringify(cfg)); } catch(_) {}
    _setLaunchState('building-srcdoc', 'Building KA game frame...', 'load');
    try { setProgress(0.3); } catch(_) {}
    var srcdoc;
    try {
      if (pastedXml) {
        srcdoc = pastedXml + '\n<scr' + 'ipt>try{window.eaglerLiteCfg=' + JSON.stringify(cfg).replace(/<\/script>/gi, '<\\/script>') + ';}catch(e){}</scr' + 'ipt>\n';
      } else {
        srcdoc = buildKASrcdoc(cfg, { stripReferrer: stripReferrer, tabName: tabName });
      }
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
      try { frame.setAttribute('allow', 'autoplay; gamepad; pointer-lock; cross-origin-isolated; presentation'); } catch(_) {}
      try { frame.setAttribute('allowfullscreen', ''); } catch(_) {}
      try {
        frame.addEventListener('error', function(ev) {
          try { window.__eaglerliteToast('Game frame error event - retrying with fallback srcdoc', 'err'); } catch(_) {}
          try { window.__eaglerliteReportError(new Error('iframe error event'), 'launchGame.iframe.error'); } catch(_) {}
          try {
            if (!frame.getAttribute('data-retried')) {
              frame.setAttribute('data-retried', '1');
              var fallbackSrcdoc = buildKASrcdoc(cfg, { stripReferrer: stripReferrer, tabName: tabName, fallback: true });
              try { frame.srcdoc = fallbackSrcdoc; } catch(_) {}
            }
          } catch(_) {}
        });
        frame.addEventListener('load', function() {
          try { window.__eaglerliteToast('Game frame loaded', 'ok'); } catch(_) {}
          try { _setLaunchState('iframe-loaded', 'Game frame loaded - waiting for runtime...', 'load'); } catch(_) {}
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
    try { frame.srcdoc = srcdoc; } catch(setErr) {
      try { window.__eaglerliteReportError(setErr, 'launchGame.frame.srcdoc'); } catch(_) {}
      throw setErr;
    }
    try { document.body.style.overflow = 'hidden'; } catch(_) {}
    _setLaunchState('iframe-ready', 'Game frame injected - waiting for Eaglercraft 1.12.2 runtime...', 'load');
    try { setProgress(0.85); } catch(_) {}
    try { logActivity('Game frame injected, awaiting runtime readiness', 'load'); } catch(_) {}
    try { pushHistory('ka-iframe', 'load', 'in-page sandboxed frame'); } catch(_) {}
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
    try { if (titleCycle) startTitleCycle(window, tabName, titleCycleList); } catch(tcErr) { try { window.__eaglerliteReportError(tcErr, 'launchGame.titleCycle'); } catch(_) {} }
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
  
  ch_titleCycle: false,
  ch_stripReferrer: true,
  faviconPreset: 'custom',
  titleCycleList: 'Home - Classroom,Google Classroom,Google Docs - Untitled document,Gmail - Inbox',
  _schema: 2,
  gameVersion: '1.12.2',
  tabName: 'Home - Classroom',
  favicon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAFXklEQVR42p2XS4gcRRjHf1X9mtnNvpNNNpuHZjURsyRZUbwYIYooKF6E3PTqQVQQBC/iVdCbFx/kohc9CF48yIpe4l5y0SRC4ooJQXeDmuxO9jEz3dX1eeienq6ZnmRxoIfq6qr6vvr+/++lthZnhOIniEgxzh5ASuO7zf+Pvb4jHIUBFJSnq3+D5stLSmtUvkUDurTZ75wkQIRhWBtXW+dW5fmeG1VZoGKNEU3LesUlfQArEOqUy+1xs2SmbY1U2QISesyW2ao7Z7ElBaRsouJdUAgtfHkiWPVPBrd1WzQa8EUEiyLEsGSm7Zvrj4dTuoXJdRTpCKTEj2xO8lt21BGR7trSekHwELZtJB+OLanHwr9pSoTOOCAF6hGpmtItJnUbg8ourLpHikvXYk56rFUYvKSQh/AvqJoyDk/8MmYCGFT2iHKR7xOuijkpfR/A+eJs61K8S8J+DKtN30vxqvUDvaLiu5/buStcOqajUngZY5Xfxoqt0M+h40DldK+LCTsQLoJWmrY1xNaglabszgNvXMYqV0uXOFwo4EbE6sM2kib7hyaYro2xkTRdwbKDKOVyQFH2p6r9SilEBAVsmZi35l/kjfkXSMXy/s9f8/GV7xgJ6qRiUSgHqoJi94KgCidBSKyhbRIAtk3M8YmDvHPyJWo6YNSv8+7CWe4fmaaVxogIsU1IrHEs4gQvVwFxHEZKUAiCFeHgyB4empjFVx6pWCIvwNOaJOdAoD1CHWBs9u3hyUMc2LWb9K5QdDjQiSQiDpEUkKQpM0MTnJi6j2PjBzg6PkvkBfxy6xqfL//IUDRELajx6ZVFlu+sFMKPjs+ysOcI0/UxjE17PN8NEr7jBVKOcBmOntbo/IhAe9lYebz20yd8dmURIykXb19nNBhCoQi0Bwie0vhaZ4RULtCDAxE2M0iuSKB9/ty8RaA8hvyI5cYqa+1NJqJdPLrnAUaCIQAemZrjt8YKjXiTS7euMzc2QyPeYmVrjUB7WDLyOgmyygtsTwhNrCHUHqvbawjQtgmvH3+elx88w9zoPmp+BEAzaXG1scK5q4t8de08vzdWsWLRQGwNvvYGYuCXUp4TB6wIc6N7OTQyTd0PSazhlbkzPHNoATEprTRmK97OEo3SnJo8zEenX+Xp2RN8ee08kQ7YNC3+uHOTGxv/4PWm8cILRPqKjyQ17B+eZH7qMHU/pJ0m7K2N89TMPK12i3aa4ClNoL2MF0rRTBOSuM2zs6eYCHcRW8OwH7Gw+wjT9XESMSil+jzRgaAckEMvILaGJE1JbQbOnaRZELLKoCZXJKt8UsRmFq15QRYLlAyAoCTaiuBpnxsb/7C6tVYUHReU4oe/LvYlpN7wKyKsJ9tZgsoXdHggVu7lBd03Y1Nia0oeKqzHm/RWiEiv7TJOIF2rKpX5uyteuulY8nSM5EkoT9GZz3dDk6eDvoq3V3iRzpWbimUAcH5/LpCBG5wc31MfFsW3s1G5Jhd2BoHcpfSvFpxZxEjal9g6tYM3oLFwvEArxEPwsEWilFKYrsqYUghRjPhRBSSK2BqsjfGxTlPSV5Q2RbNts0OMG8D7b5z/KaUwJubw6D6+f+49Qu2T5qHXiGUyGubtC19w7tI3EA7TFK8fAg3E4nE6vOl9MLZEXaVZWJad9WdGLOPhELt/baOsBpW5rkWo6YCz65c5NrUMus6T4U1i6bZnavPbUDq9S02l+D11+70bwO6wsQHthttbisBwAMOTQATGQqubILvNqcohsBL1cFeqJfZYRwH+qEZHYFqCKmnRskKzafE1eFqqm1MqOteB5pcBa1KL9gW/BpJ222zd7UzQobv3P84Uh9XBoaIYAAAAAElFTkSuQmCC',
  sprintKey: 'ControlLeft',
  panicLink: 'https://classroom.google.com',
  panicKey: 'Equal',
  wsProxyUrl: 'wss://eaglerlite-proxy.onrender.com/',
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
  if (!stack) { try { console.log('[EaglerLite toast]', msg); } catch(_) {} return; }
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
      try { console.log('[EaglerLite v2.1] migrating config schema v' + (config._schema || 1) + ' → v2'); } catch(_) {}
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
if (loaded) {
  try { console.log('[EaglerLite] Config restored from localStorage'); } catch(_) {}
}

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
  document.documentElement.setAttribute('data-theme', theme);
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
  var name = document.getElementById('profileSelect').value;
  if (!name) { showToast('Choose a profile first'); return; }
  var profiles = loadProfiles();
  if (!profiles[name]) { showToast('Profile not found'); return; }
  applyConfigToDOM(profiles[name]);
  scheduleSave();
  showToast('Profile "' + name + '" loaded');
  logActivity('Profile loaded: ' + name, 'ok');
}); } catch(_) {}
try { window.__eaglerliteBindClick('deleteProfileBtn', function() {
  var name = document.getElementById('profileSelect').value;
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
      showToast('Copy failed - check console');
      try { console.log('[EaglerLite] Launch URL:', url); } catch(_) {}
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

setTimeout(function() { try { probeProxyHealth(); } catch(_) {} }, 1500);

try { window.__eaglerliteBindEvent('wsProxyUrl', 'change', function() {
  setTimeout(function() { try { probeProxyHealth(); } catch(_) {} }, 100);
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

try {
  if ('relayOpener' in window) {
    Object.defineProperty(window, 'relayOpener', { get: function() { return null; }, set: function() {}, configurable: true });
  }
} catch(_) {}

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

function fetchWithRetry(url, ms, retries) {
  var attempt = 0;
  function tryOnce() {
    attempt++;
    var ctrl = new AbortController();
    var t = setTimeout(function() { ctrl.abort(); }, ms);
    return fetch(url, { signal: ctrl.signal, cache: 'force-cache' })
      .then(function(r) { clearTimeout(t); if (!r.ok) throw new Error('HTTP ' + r.status); return r; })
      .catch(function(e) {
        clearTimeout(t);
        if (attempt >= retries) throw e;
        var delay = Math.min(4000, Math.pow(2, attempt - 1) * 1000);
        return new Promise(function(resolve) {
          setTimeout(function() { resolve(tryOnce()); }, delay);
        });
      });
  }
  return tryOnce();
}

var SRC_CACHE_NAME = 'eaglerlite-v2';
function cacheSourceResponse(url, response) {
  try {
    if (!('caches' in window) || !response) return Promise.resolve(null);
    return caches.open(SRC_CACHE_NAME).then(function(c) {
      try { return c.put(url, response.clone()); } catch(e) { return null; }
    }).catch(function() { return null; });
  } catch(_) { return Promise.resolve(null); }
}
function tryCachedSource(url) {
  try {
    if (!('caches' in window)) return Promise.resolve(null);
    return caches.match(url, { ignoreSearch: true }).then(function(r) {
      if (r && r.ok) return r;
      return null;
    }).catch(function() { return null; });
  } catch(_) { return Promise.resolve(null); }
}

var _titleCycleTimer = null;
function startTitleCycle(win, primaryTitle, csvList) {
  stopTitleCycle();
  if (!win || !csvList) return;
  var titles = String(csvList).split(',').map(function(s) { return s.trim(); }).filter(Boolean);
  if (titles.length === 0) titles = [primaryTitle];
  if (titles.indexOf(primaryTitle) === -1) titles.unshift(primaryTitle);
  var idx = 0;
  _titleCycleTimer = setInterval(function() {
    try {
      idx = (idx + 1) % titles.length;
      win.document.title = titles[idx];
    } catch(_) { stopTitleCycle(); }
  }, 5000);
}
function stopTitleCycle() {
  if (_titleCycleTimer) { clearInterval(_titleCycleTimer); _titleCycleTimer = null; }
}

function buildReferrerMeta(strip) {
  return strip ? '<meta name="referrer" content="no-referrer">\n' : '';
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

try { window.__eaglerliteBindClick('editTitleCycleBtn', function() {
  var inp = document.getElementById('titleCycleList');
  if (!inp) return;
  inp.style.display = inp.style.display === 'none' ? 'block' : 'none';
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
    try { console.log('[EaglerLite v2 AutoLaunch] Config applied from URL, attempting auto-launch\u2026'); } catch (_) {}
    logActivity('AutoLaunch: config applied from URL', 'load');

    var origOpen = window.open;
    var popupResult = 'pending';
    window.open = function () {
      var w = origOpen.apply(this, arguments);
      popupResult = w ? 'opened' : 'blocked';
      return w;
    };

    function closeThisTab() {
      setTimeout(function () {
        try { window.close(); } catch (e) {}
        setTimeout(function () {
          try { window.location.href = 'about:blank'; } catch (e) {}
        }, 200);
      }, 800);
    }

    function showLaunchOverlay() {
      if (document.getElementById('autoLaunchOverlay')) return;
      var overlay = document.createElement('div');
      overlay.id = 'autoLaunchOverlay';
      Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
        background: 'var(--bg)', zIndex: '99999', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', userSelect: 'none', fontFamily: "'Courier New', monospace"
      });
      overlay.innerHTML =
        '<div style="text-align:center;color:var(--text);">' +
          '<div style="font-size:2.2rem;font-weight:800;letter-spacing:0.12em;margin-bottom:0.6rem;">CLICK TO LAUNCH</div>' +
          '<div style="font-size:0.78rem;color:var(--muted);letter-spacing:0.18em;text-transform:uppercase;">EaglerLite v2 &middot; Auto-Launch</div>' +
          '<div style="margin-top:2rem;font-size:0.78rem;color:var(--load);max-width:420px;line-height:1.7;">' +
            'Your configuration has been applied.<br>Click anywhere to launch Eaglercraft.<br>' +
            '<span style="color:var(--muted);">This tab will close automatically after launch.</span>' +
          '</div>' +
        '</div>';

      var launched = false;
      overlay.addEventListener('click', function () {
        if (launched) return;
        launched = true;
        if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
        popupResult = 'pending';
        try {
          var btn = document.getElementById('launchBtn');
          if (btn) { btn.disabled = false; btn.textContent = 'Launch Game'; }
          var progEl = document.getElementById('prog-fill');
          if (progEl) progEl.style.width = '0%';
        } catch (_) {}
        try {
          if (typeof launchGame === 'function') launchGame();
          else { var btn2 = document.getElementById('launchBtn'); if (btn2) btn2.click(); }
        } catch (e) {
          try { console.error('[EaglerLite v2 AutoLaunch] Manual launch error:', e); } catch (_) {}
        }
        var attempts = 0;
        function watch() {
          attempts++;
          if (popupResult === 'opened') { closeThisTab(); return; }
          if (popupResult === 'blocked' && attempts > 4) {
            launched = false; showLaunchOverlay(); return;
          }
          if (attempts < 60) setTimeout(watch, 200);
        }
        setTimeout(watch, 100);
      });

      document.body.appendChild(overlay);
    }

    setTimeout(function () {
      try {
        if (typeof launchGame === 'function') launchGame();
        else { var btn = document.getElementById('launchBtn'); if (btn) btn.click(); }
      } catch (e) {
        try { console.error('[EaglerLite v2 AutoLaunch] Auto-launch error:', e); } catch (_) {}
        showLaunchOverlay();
        return;
      }

      var attempts = 0;
      function watchAuto() {
        attempts++;
        if (popupResult === 'opened') {
          try { console.log('[EaglerLite v2 AutoLaunch] Game tab opened \u2014 closing this tab.'); } catch (_) {}
          closeThisTab();
          return;
        }
        if (popupResult === 'blocked') {
          try { console.log('[EaglerLite v2 AutoLaunch] Popup blocked \u2014 showing click-to-launch overlay.'); } catch (_) {}
          showLaunchOverlay();
          return;
        }
        if (attempts < 50) setTimeout(watchAuto, 200);
        else showLaunchOverlay();
      }
      setTimeout(watchAuto, 100);
    }, 100);
  } catch (e) {
    try { console.error('[EaglerLite v2 AutoLaunch] Snippet error:', e); } catch (_) {}
  }
})();

try { _ensureReadyListener(); } catch(_) {}

setTimeout(function() {
  try {
    if (window.__eaglerliteCSP && (window.__eaglerliteCSP.fetchCors === 'blocked' || window.__eaglerliteCSP.fetchCors === 'no-fetch' || window.__eaglerliteCSP.fetchCors === 'timeout')) {
      probeProxyHealth = function() {
        try {
          var dot = document.getElementById('healthDot');
          var label = document.getElementById('healthLabel');
          if (dot) dot.className = 'health-dot load';
          if (label) label.textContent = 'Proxy: skipped (CSP)';
        } catch(_) {}
        try { window.__eaglerliteCSP.proxy = 'skipped'; } catch(_) {}
      };
      try { _warmupDone = true; } catch(_) {}
      try { probeProxyHealth(); } catch(_) {}
    } else {
      try { probeProxyHealth(); } catch(_) {}
    }
  } catch(_) {}
}, 9000);
