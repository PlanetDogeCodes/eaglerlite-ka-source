/* EaglerLite v2.1 - KA Launcher JS
 * Loaded via <script src="https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-launcher.js">
 * inside Khan Academy's sandboxed webpage compiler iframe.
 * Vanilla ES5 (no transpilation). Vanilla 1.12.2 Eaglercraft runtime.
 */
(function () {
  'use strict';
  try {
    if (!window.__eaglerliteErrors) window.__eaglerliteErrors = [];
    if (typeof window.__eaglerliteReportError !== 'function') {
      window.__eaglerliteReportError = function (err, ctx) {
        try {
          var entry = {
            msg: (err && err.message) ? err.message : String(err),
            stack: (err && err.stack) ? err.stack : '',
            time: new Date().toISOString(),
            ctx: ctx || ''
          };
          window.__eaglerliteErrors.push(entry);
          if (window.__eaglerliteErrors.length > 50) window.__eaglerliteErrors.shift();
        } catch (_) {}
      };
    }
    function _hideBootstrapLoader() {
      try { var el = document.getElementById('bootstrapLoader'); if (el) el.style.display = 'none'; } catch (_) {}
    }
    function _showBootstrapError(msg) {
      try {
        var el = document.getElementById('bootstrapError');
        if (el) el.style.display = 'block';
        var inner = el && el.querySelector('.bootstrap-error-msg');
        if (inner && msg) inner.textContent = msg;
        var retry = document.getElementById('retryBtn');
        if (retry) retry.style.display = 'inline-block';
      } catch (_) {}
    }
    function _revealManualPaste() {
      try { var box = document.getElementById('manualPasteBox'); if (box) box.style.display = 'block'; } catch (_) {}
    }
    function _fallbackCopyText(text) {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.top = '-1000px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        var ok = false;
        try { ok = document.execCommand('copy'); } catch (_) { ok = false; }
        document.body.removeChild(ta);
        try { showToast(ok ? 'Errors copied to clipboard' : 'Copy failed - see console', ok ? 'ok' : 'err'); } catch (_) {}
        if (!ok) { try { console.log('[EaglerLite] Errors:', text); } catch (_) {} }
      } catch (_) {}
    }
    function _copyErrorsToClipboard() {
      try {
        var json = JSON.stringify(window.__eaglerliteErrors || [], null, 2);
        try {
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(json).then(function () {
              try { showToast('Errors copied to clipboard', 'ok'); } catch (_) {}
            }).catch(function () { _fallbackCopyText(json); });
            return;
          }
        } catch (_) {}
        _fallbackCopyText(json);
      } catch (e) {
        try { showToast('Copy errors failed: ' + e.message, 'err'); } catch (_) {}
      }
    }
    function fetchSourceWithFallbacks(opts) {
      opts = opts || {};
      var urls = opts.urls || SRC_URL_112_FALLBACKS;
      var timeoutMs = (typeof opts.timeout === 'number') ? opts.timeout : 30000;
      var onProgress = opts.onProgress || function () {};
      var total = urls.length;
      function tryUrl(idx) {
        if (idx >= total) {
          return Promise.reject(new Error('All source URLs failed'));
        }
        var url = urls[idx];
        onProgress(idx + 1, total, url);
        var ctrl;
        try { ctrl = new AbortController(); } catch (_) { ctrl = { abort: function () {} }; }
        var timer = setTimeout(function () { try { ctrl.abort(); } catch (_) {} }, timeoutMs);
        return fetch(url, { signal: ctrl.signal, cache: 'no-store' })
          .then(function (r) {
            clearTimeout(timer);
            if (!r.ok) throw new Error('HTTP ' + r.status);
            var ct = '';
            try { ct = (r.headers.get('content-type') || '').toLowerCase(); } catch (_) {}
            if (ct && ct.indexOf('text/html') !== -1) throw new Error('Wrong MIME: ' + ct);
            return r.text();
          })
          .catch(function (err) { clearTimeout(timer); return tryUrl(idx + 1); });
      }
      return tryUrl(0);
    }
    var _activeTimers = [];
    var _activeListeners = [];
    function _trackTimer(id) { _activeTimers.push(id); return id; }
    function _untrackTimer(id) {
      for (var i = _activeTimers.length - 1; i >= 0; i--) {
        if (_activeTimers[i] === id) { _activeTimers.splice(i, 1); break; }
      }
    }
    function _trackListener(target, type, fn) {
      _activeListeners.push({ target: target, type: type, fn: fn });
      try { target.addEventListener(type, fn); } catch (_) {}
    }
    function _on(id, evt, fn) {
      try {
        var el = document.getElementById(id);
        if (el) el.addEventListener(evt, fn);
      } catch (_) {}
    }
    function cleanup() {
      for (var i = 0; i < _activeTimers.length; i++) {
        try { clearTimeout(_activeTimers[i]); clearInterval(_activeTimers[i]); } catch (_) {}
      }
      _activeTimers = [];
      for (var j = 0; j < _activeListeners.length; j++) {
        var L = _activeListeners[j];
        try { L.target.removeEventListener(L.type, L.fn); } catch (_) {}
      }
      _activeListeners = [];
    }

    var SRC_URL_112_FALLBACKS = [
      'https://cdn.jsdelivr.net/gh/PlanetDogeCodes/EaglerLite@main/source%20file/egc1-12.xml',
      'https://raw.githubusercontent.com/PlanetDogeCodes/EaglerLite/main/source%20file/egc1-12.xml',
      'https://api.codetabs.com/v1/proxy/?quest=' + encodeURIComponent('https://cdn.jsdelivr.net/gh/PlanetDogeCodes/EaglerLite@main/source%20file/egc1-12.xml')
    ];
    var SRC_URL_112 = SRC_URL_112_FALLBACKS[0];

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
      var el = document.getElementById('statusText');
      if (!el) return;
      el.textContent = msg;
      el.className = cls || '';
      pushTimeline(msg, cls);
    }
    function setProgress(v) {
      var el = document.getElementById('progressFill');
      if (!el) return;
      el.style.width = Math.round(Math.max(0, Math.min(1, v)) * 100) + '%';
    }
    function setBusy(on) {
      var btn = document.getElementById('launchBtn');
      if (!btn) return;
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
      try { return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || '[]'); }
      catch(_) { return []; }
    }
    function saveActivity(arr) {
      try { localStorage.setItem(ACTIVITY_KEY, JSON.stringify(arr.slice(-50))); }
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
            if (node.nodeType === 8) { launcherComment = '<!--' + node.nodeValue + '-->\n'; break; }
            if (node.nodeType === 1) break;
          }
        } catch(_) {}
        var cloneRoot = document.documentElement.cloneNode(true);

        var cStatus = cloneRoot.querySelector('#statusText');
        if (cStatus) { cStatus.textContent = 'Ready \u2014 configure below and click Launch'; cStatus.className = ''; }
        var cProg = cloneRoot.querySelector('#progressFill');
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
    dot.className = 'health-dot load';
    label.textContent = 'Proxy: checking\u2026';
    var proxyUrlEl = document.getElementById('wsProxyUrl');
    var proxyUrl = (proxyUrlEl && proxyUrlEl.value && proxyUrlEl.value.trim()) || 'wss://eaglerlite-proxy.onrender.com/';
    var httpsUrl = proxyUrl.replace(/^wss:/, 'https:').replace(/^ws:/, 'http:').replace(/\/$/, '') + '/health';
    var delays = [250, 750, 2000];
    var retryIdx = 0;
    function showReachable(r) {
      if (r.ok) {
        dot.className = 'health-dot ok';
        label.textContent = 'Proxy: \u2713 healthy';
      } else if (r.status) {
        dot.className = 'health-dot err';
        label.textContent = 'Proxy: HTTP ' + r.status;
      } else {
        dot.className = 'health-dot load';
        label.textContent = 'Proxy: unreachable (singleplayer still works)';
      }
    }
    function attempt() {
      _probeOnce(httpsUrl, 5000).then(function (r) {
        if (r.ok || r.status) { showReachable(r); }
        else if (retryIdx < delays.length) {
          var delay = delays[retryIdx]; retryIdx++;
          setTimeout(attempt, delay);
        } else {
          dot.className = 'health-dot load';
          label.textContent = 'Proxy: unreachable (singleplayer still works)';
          try { console.warn('[EaglerLite] Proxy unreachable after 3 retries; singleplayer still works'); } catch (_) {}
        }
      });
    }
    attempt();
  } catch (e) {
    try { if (window.__eaglerliteReportError) window.__eaglerliteReportError(e, 'probeProxyHealth'); } catch (_) {}
  }
}

    function _probeOnce(httpsUrl, timeoutMs) {
      return new Promise(function (resolve) {
        var ctrl;
        try { ctrl = new AbortController(); } catch (_) { ctrl = { abort: function () {} }; }
        var timer = setTimeout(function () { try { ctrl.abort(); } catch (_) {} }, timeoutMs);
        fetch(httpsUrl, { method: 'GET', signal: ctrl.signal, cache: 'no-store' })
          .then(function (r) { clearTimeout(timer); resolve({ ok: r.ok, status: r.status }); })
          .catch(function (err) { clearTimeout(timer); resolve({ ok: false, err: err }); });
      });
    }

    function buildKASrcdoc(cfg, opts) {
      opts = opts || {};
      var stripReferrer = opts.stripReferrer !== false;
      var refMeta = stripReferrer ? '<meta name="referrer" content="no-referrer">\n' : '';

      var cfgJson = JSON.stringify(cfg).replace(/<\/script>/gi, '<\\/script>');
      var runtime = 'https://cdn.jsdelivr.net/npm/eag-web-sp@1.0.4/classes1_mod.js';
      var assets = 'https://cdn.jsdelivr.net/npm/eag-web-sp@1.0.4/assets_uri.js';

      var parts = [
        '<!DOCTYPE html>\n',
        '<html>\n<head>\n',
        '<title>Spin-off of "Eaglercraft Singleplayer Test"</title>\n',
        '<meta charset="UTF-8">\n',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
        refMeta,
        '<scr' + 'ipt src="' + runtime + '"></scr' + 'ipt>\n',
        '<scr' + 'ipt src="' + assets + '"></scr' + 'ipt>\n',
        '<style>html,body{margin:0;padding:0;width:100vw;height:100vh;overflow:hidden;background:#000000}#toastStack{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);z-index:100000001;display:flex;flex-direction:column-reverse;gap:4px;pointer-events:none;max-width:90vw}.toast-item{background:#222;color:#eee;padding:6px 12px;border-radius:6px;font:13px monospace;opacity:0;transition:opacity .2s;max-width:90vw}.toast-item.show{opacity:1}.toast-item.err{background:#400;border:1px solid #f55}.toast-item.ok{background:#040;border:1px solid #5f5}</style>\n',
        '</head>\n',
        '<body id="game_frame">\n',
        '<div id="toastStack"></div>\n',
        '<scr' + 'ipt>\n',
        '(function(){\n',
        '  try {\n',
        '  try { eval("function KAInfiniteLoopProtect(){}"); } catch(e) {}\n',
        '  function toast(m,k){var s=document.getElementById("toastStack");if(!s){try{console.log("[KA]",m);}catch(_){}return;}var t=document.createElement("div");t.className="toast-item "+(k||"");t.textContent=String(m);s.appendChild(t);requestAnimationFrame(function(){t.classList.add("show")});setTimeout(function(){t.classList.remove("show");setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},300)},k==="err"?5000:2500)}\n',
        '  function decodeAssets(){\n',
        '    try {\n',
        '      if (!window.assetsUri) { toast("assets_uri.js failed to load","err"); try{window.parent.postMessage({type:"eaglerlite-fail",reason:"asset uri missing"},"*");}catch(_){} return false; }\n',
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
        '  window.addEventListener("load", function(){\n',
        '    if (!decodeAssets()) return;\n',
        '    try {\n',
        '      window.minecraftOpts = ["game_frame", ""];\n',
        '      if (typeof main === "function") { main(); toast("launched","ok"); try{window.parent.postMessage({type:"eaglerlite-ready"},"*");}catch(_){} }\n',
        '      else { toast("main() not found - runtime did not load","err"); try{window.parent.postMessage({type:"eaglerlite-fail",reason:"main not found"},"*");}catch(_){} }\n',
        '    } catch(e) { toast("launch failed: "+e.message,"err"); try{window.parent.postMessage({type:"eaglerlite-fail",reason:"launch error"},"*");}catch(_){} }\n',
        '  });\n',
        '  try { window.eaglerLiteCfg = ' + cfgJson + '; } catch(e) {}\n',
        '  } catch(_readyErr) { try { window.parent.postMessage({type:"eaglerlite-fail",reason:"readiness error: "+((_readyErr&&_readyErr.message)?_readyErr.message:String(_readyErr))},"*"); } catch(_) {} }\n',
        '})();\n',
        '</scr' + 'ipt>\n',
        '</body>\n</html>\n'
      ];
      return parts.join('');
    }

    function launchGame(pastedContent) {
      var launchBtn = document.getElementById('launchBtn');
      if (!launchBtn) {
        try { if (window.__eaglerliteReportError) window.__eaglerliteReportError(new Error('launchBtn not found'), 'launchGame'); } catch (_) {}
        _showBootstrapError('Critical: launch button missing. Refresh and try again.');
        return;
      }
      if (launchBtn.disabled) return;
      setBusy(true);
      try {
        var tabName = (document.getElementById('tabName').value.trim()) || 'Eaglercraft';
        var sprintKey = (document.getElementById('sprintKey').value.trim()) || 'ControlLeft';
        var favicon = document.getElementById('favicon').value.trim();
        var stripReferrer = document.getElementById('ch_stripReferrer') ? (document.getElementById('ch_stripReferrer').value === 'true') : true;
        var cfg = {
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
        try { localStorage.setItem('eaglerLiteLastLaunch_v2', JSON.stringify(cfg)); } catch(_) {}
        setProgress(0.3); setStatus((pastedContent && typeof pastedContent === 'string') ? 'Building KA game frame from pasted source...' : 'Building KA game frame...', 'load');
        var srcdoc;
        if (pastedContent && typeof pastedContent === 'string') {
          var _readyScript = '</scr' + 'ipt><scr' + 'ipt>(function(){try{function _r(){try{window.parent.postMessage({type:"eaglerlite-ready"},"*")}catch(e){}}if(document.readyState==="complete"||document.readyState==="interactive"){setTimeout(_r,800)}else{document.addEventListener("DOMContentLoaded",function(){setTimeout(_r,800)});window.addEventListener("load",function(){setTimeout(_r,800)})}}catch(_rErr){try{window.parent.postMessage({type:"eaglerlite-fail",reason:"readiness error: "+((_rErr&&_rErr.message)?_rErr.message:String(_rErr))},"*")}catch(_){}}})()</scr' + 'ipt>';
          srcdoc = String(pastedContent).replace(/^<\?xml[^>]*\?>\s*/i, '') + _readyScript;
        } else {
          srcdoc = buildKASrcdoc(cfg, { stripReferrer: stripReferrer, tabName: tabName });
        }
        setProgress(0.7); setStatus('Injecting frame into KA document...', 'load');

        cleanup();
        var frame = document.getElementById('kaGameFrame');
        if (!frame) {
          frame = document.createElement('iframe');
          frame.id = 'kaGameFrame';
          frame.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-pointer-lock allow-forms allow-popups allow-modals allow-presentation allow-orientation-lock');
          frame.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;border:none;z-index:9999;background:#000000;';
          document.body.appendChild(frame);
        }
        var bar = document.getElementById('embedCloseBar');
        if (bar) bar.className = '';
        frame.srcdoc = srcdoc;
        document.body.style.overflow = 'hidden';
        setProgress(1); setStatus('Game frame injected - click inside the frame to focus keyboard.', 'ok');
        logActivity('Game launched via inline KA iframe', 'ok');
        pushHistory('ka-iframe', 'ok', 'in-page sandboxed frame');
        var readyFired = false;
        var readyTimer = _trackTimer(setTimeout(function () {
          if (readyFired) return;
          readyFired = true;
          setStatus('Launch timed out - try the manual paste fallback', 'err');
          _revealManualPaste();
          logActivity('Launch timed out after 60s', 'err');
        }, 60000));
        var readyHandler = function (e) {
          try {
            if (!e || !e.data || typeof e.data !== 'object') return;
            if (e.source !== frame.contentWindow) return;
            if (e.data.type === 'eaglerlite-ready') {
              if (readyFired) return;
              readyFired = true;
              try { clearTimeout(readyTimer); _untrackTimer(readyTimer); } catch (_) {}
              try { window.removeEventListener('message', readyHandler); } catch (_) {}
              setStatus('Launched 1.12.2!', 'ok');
              logActivity('Eaglercraft 1.12.2 ready', 'ok');
            } else if (e.data.type === 'eaglerlite-fail') {
              if (readyFired) return;
              readyFired = true;
              try { clearTimeout(readyTimer); _untrackTimer(readyTimer); } catch (_) {}
              try { window.removeEventListener('message', readyHandler); } catch (_) {}
              setStatus('Launch failed - ' + (e.data.reason || 'unknown'), 'err');
              _revealManualPaste();
              logActivity('Launch failed: ' + (e.data.reason || 'unknown'), 'err');
            }
          } catch (_) {}
        };
        _trackListener(window, 'message', readyHandler);
        var closeBtn = document.getElementById('embedCloseBtn');
        if (closeBtn) {
          var newClose = closeBtn.cloneNode(true);
          closeBtn.parentNode.replaceChild(newClose, closeBtn);
          newClose.addEventListener('click', function () {
            try { cleanup(); } catch (_) {}
            var f = document.getElementById('kaGameFrame');
            if (f) { try { f.srcdoc = ''; } catch (_) {} f.remove(); }
            var b = document.getElementById('embedCloseBar');
            if (b) b.className = 'hidden';
            document.body.style.overflow = '';
            setStatus('Game frame closed. Ready to launch again.', 'load');
            logActivity('Game frame closed by user', 'load');
          });
        }
      } catch (e) {
        setStatus('Error launching: ' + e.message, 'err');
        logActivity('Launch error: ' + e.message, 'err');
        pushHistory('error', 'err', e.message);
      } finally {
        setBusy(false);
      }
    }

    _on('launchBtn', 'click', function (e) { if (e && e.preventDefault) e.preventDefault(); launchGame(); });
    _on('downloadBtn', 'click', downloadLauncher);
    _on('tabName', 'keydown', function(e) { if (e.key === 'Enter') launchGame(); });

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
          localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
          showToast('Configuration saved');
          logActivity('Config saved', 'ok');
        } catch (e) {
          if (e && (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED' || e.code === 22 || e.code === 1014)) {
            showToast('Save failed: storage quota exceeded. Resetting to free space.');
            try {
              localStorage.removeItem(CONFIG_KEY);
              localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
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
        var raw = localStorage.getItem(CONFIG_KEY);
        if (!raw) return false;
        var config;
        try { config = JSON.parse(raw); }
        catch(parseErr) {

          var ts = Date.now();
          try { localStorage.setItem(CONFIG_KEY + '_corrupt_' + ts, raw); } catch(_) {}
          try { localStorage.removeItem(CONFIG_KEY); } catch(_) {}
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
          try { localStorage.setItem(CONFIG_KEY, JSON.stringify(config)); } catch(_) {}
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
        localStorage.removeItem(CONFIG_KEY);
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
      try { return localStorage.getItem(CONFIG_KEY); } catch(_) { return null; }
    })();
    function scheduleSave() {
      if (saveTimer) clearTimeout(saveTimer);
      saveTimer = setTimeout(function() {
        saveTimer = null;
        try {
          var serialized = JSON.stringify(readConfigFromDOM());
          if (_lastSavedConfig === serialized) return;
          _lastSavedConfig = serialized;
          localStorage.setItem(CONFIG_KEY, serialized);
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

    _on('saveCfgBtn', 'click', saveConfig);
    _on('resetCfgBtn', 'click', resetConfig);
    _on('resetCancelBtn', 'click', function() {
      var m = document.getElementById('resetModal');
      if (m) m.className = 'modal-overlay hidden';
    });
    _on('resetConfirmBtn', 'click', function() {
      var m = document.getElementById('resetModal');
      if (m) m.className = 'modal-overlay hidden';
      _doReset();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.keyCode === 27) {
        var modal = document.getElementById('resetModal');
        if (modal && !modal.classList.contains('hidden')) {
          modal.className = 'modal-overlay hidden';
        }
      }
    });

    function applyTheme(theme) {
      var valid = { dark:1, light:1, midnight:1, terminal:1 };
      if (!valid[theme]) theme = 'dark';
      document.documentElement.setAttribute('data-theme', theme);
      var dots = document.querySelectorAll('.theme-dot');
      for (var i = 0; i < dots.length; i++) {
        if (dots[i].getAttribute('data-theme-val') === theme) dots[i].classList.add('active');
        else dots[i].classList.remove('active');
      }
      try { localStorage.setItem('eaglerLiteTheme_v2', theme); } catch(_) {}
    }
    (function() {
      try {
        var saved = localStorage.getItem('eaglerLiteTheme_v2') || 'dark';
        applyTheme(saved);
      } catch(_) { applyTheme('dark'); }
    })();
    _on('themeSwitcher', 'click', function(e) {
      var t = e.target && e.target.closest ? e.target.closest('.theme-dot') : null;
      if (!t) return;
      var v = t.getAttribute('data-theme-val');
      applyTheme(v);
      scheduleSave();
    });

    var PROFILES_KEY = 'eaglerLiteProfiles_v2';
    function loadProfiles() {
      try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || '{}'); }
      catch(_) { return {}; }
    }
    function saveProfiles(obj) {
      try { localStorage.setItem(PROFILES_KEY, JSON.stringify(obj)); } catch(_) {}
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
    _on('saveProfileBtn', 'click', function() {
      var name = (document.getElementById('profileName').value || '').trim();
      if (!name) { showToast('Enter a profile name first'); return; }
      var profiles = loadProfiles();
      profiles[name] = readConfigFromDOM();
      saveProfiles(profiles);
      refreshProfileSelect();
      document.getElementById('profileSelect').value = name;
      showToast('Profile "' + name + '" saved');
      logActivity('Profile saved: ' + name, 'ok');
    });
    _on('loadProfileBtn', 'click', function() {
      var name = document.getElementById('profileSelect').value;
      if (!name) { showToast('Choose a profile first'); return; }
      var profiles = loadProfiles();
      if (!profiles[name]) { showToast('Profile not found'); return; }
      applyConfigToDOM(profiles[name]);
      scheduleSave();
      showToast('Profile "' + name + '" loaded');
      logActivity('Profile loaded: ' + name, 'ok');
    });
    _on('deleteProfileBtn', 'click', function() {
      var name = document.getElementById('profileSelect').value;
      if (!name) { showToast('Choose a profile first'); return; }
      if (!confirm('Delete profile "' + name + '"?')) return;
      var profiles = loadProfiles();
      delete profiles[name];
      saveProfiles(profiles);
      refreshProfileSelect();
      showToast('Profile "' + name + '" deleted');
      logActivity('Profile deleted: ' + name, 'load');
    });
    refreshProfileSelect();

    _on('exportCfgBtn', 'click', function() {
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
    });
    _on('importCfgBtn', 'click', function() {
      var f = document.getElementById('importCfgFile');
      if (f) f.click();
    });
    _on('importCfgFile', 'change', function(e) {
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
      e.target.value = '';
    });

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {

        var modal = document.getElementById('resetModal');
        if (modal && !modal.classList.contains('hidden')) return;
        if (typeof panicCapturing !== 'undefined' && panicCapturing) return;
        e.preventDefault();
        if (typeof launchGame === 'function') launchGame();
      }
    });

    _on('copyAutolaunchBtn', 'click', function() {
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
    });

    var panicCapturing = false;
    _on('panicTestBtn', 'click', function() {
      panicCapturing = true;
      var kbd = document.getElementById('panicTestKbd');
      kbd.textContent = 'Press any key\u2026';
      kbd.style.background = '#f3d77a';
    });
    document.addEventListener('keydown', function(e) {
      if (!panicCapturing) return;
      e.preventDefault();
      e.stopPropagation();
      panicCapturing = false;
      var kbd = document.getElementById('panicTestKbd');
      var code = e.code || e.key;
      kbd.textContent = code;
      kbd.style.background = '';
      document.getElementById('panicKey').value = code;
      scheduleSave();
      showToast('Panic key set to: ' + code);
    }, true);

    (function() {
      try {
        var dismissedAt = +localStorage.getItem('eaglerLiteBannerDismissed_v2') || 0;
        var sevenDays = 7 * 24 * 60 * 60 * 1000;
        if (dismissedAt && (Date.now() - dismissedAt) < sevenDays) {
          var b = document.getElementById('eaglerNodesBanner');
          if (b) b.style.display = 'none';
        }
      } catch(_) {}
    })();
    _on('bannerDismiss', 'click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      var b = document.getElementById('eaglerNodesBanner');
      if (b) b.style.display = 'none';
      try { localStorage.setItem('eaglerLiteBannerDismissed_v2', String(Date.now())); } catch(_) {}
      showToast('Banner dismissed for 7 days');
    });

    setTimeout(function() { try { probeProxyHealth(); } catch(_) {} }, 1500);

    _on('wsProxyUrl', 'change', function() {
      setTimeout(probeProxyHealth, 100);
    });

    (function() {
      try {
        var ind = document.getElementById('autoModeIndicator');
        if (!ind) return;
        if (detectSandbox()) {
          ind.textContent = 'Mode: sandbox (iframe embed fallback ready)';
          ind.style.color = '#f3d77a';
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
    _on('kbdCloseBtn', 'click', toggleKbdOverlay);
    _on('kbdOverlay', 'click', function(e) {
      if (e.target === this) toggleKbdOverlay();
    });

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
      try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
      catch(_) { return []; }
    }
    function saveHistory(arr) {
      try { localStorage.setItem(HISTORY_KEY, JSON.stringify(arr.slice(-10))); }
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

    function buildReferrerMeta(strip) {
      return strip ? '<meta name="referrer" content="no-referrer">\n' : '';
    }

    document.addEventListener('keydown', function(e) {
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
    });

    (function () {
      var PRESETS = {
        'vanilla': {
          on:  ['ch7','ch8','ch9','ch10','ch19','ch20','ch2'],
          off: ['ch1','ch3','ch4','ch5','ch6','ch11','ch12','ch13','ch14','ch15','ch16','ch17','ch18','ch21']
        },
        'speedrun': {
          on:  ['ch8','ch9','ch10','ch19','ch1','ch3','ch5','ch6','ch11','ch14','ch15','ch18'],
          off: ['ch2','ch4','ch7','ch12','ch13','ch16','ch17','ch20','ch21']
        },
        'stealth': {
          on:  ['ch_stripReferrer','ch1','ch3','ch11','ch14','ch15','ch18'],
          off: ['ch4','ch5','ch6','ch7','ch8','ch9','ch10','ch12','ch13','ch16','ch17','ch19','ch20','ch21','ch2']
        },
        'performance': {
          on:  ['ch21','ch19','ch1','ch3','ch4','ch5','ch11','ch14','ch15','ch16','ch17','ch18','ch12','ch13'],
          off: ['ch2','ch6','ch7','ch8','ch9','ch10','ch20']
        }
      };
      function updateModCount() {
        var badge = document.getElementById('modCountBadge');
        if (!badge) return;
        var total = 21, on = 0;
        for (var i = 1; i <= total; i++) {
          var cb = document.getElementById('ch' + i);
          if (cb && cb.checked) on++;
        }
        badge.textContent = on + '/' + total;
      }
      updateModCount();
      for (var k = 1; k <= 21; k++) {
        _on('ch' + k, 'change', updateModCount);
      }
      _on('quickPresetSelect', 'change', function () {
        var sel = document.getElementById('quickPresetSelect');
        if (!sel) return;
        var key = (sel.value || '').toLowerCase();
        var p = PRESETS[key];
        if (!p) return;
        function setAll(arr, val) {
          for (var i = 0; i < arr.length; i++) {
            var el = document.getElementById(arr[i]);
            if (el) el.checked = val;
          }
        }
        setAll(p.on, true);
        setAll(p.off, false);
        sel.value = '';
        updateModCount();
        var badge = document.getElementById('modCountBadge');
        if (badge && badge.title) badge.title = 'Mods enabled: ' + (function(){var n=0;for(var i=1;i<=21;i++){var c=document.getElementById('ch'+i);if(c&&c.checked)n++;}return n;})() + '/21';
        try { showToast('Preset applied'); scheduleSave(); } catch (_) {}
      });
    })();

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
            background: 'rgba(0,0,0,0.95)', zIndex: '99999', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', userSelect: 'none', fontFamily: "'Courier New', monospace"
          });
          overlay.innerHTML =
            '<div style="text-align:center;color:#fff;">' +
              '<div style="font-size:2.2rem;font-weight:800;letter-spacing:0.12em;margin-bottom:0.6rem;">CLICK TO LAUNCH</div>' +
              '<div style="font-size:0.78rem;color:#888;letter-spacing:0.18em;text-transform:uppercase;">EaglerLite v2 &middot; Auto-Launch</div>' +
              '<div style="margin-top:2rem;font-size:0.78rem;color:#aaa;max-width:420px;line-height:1.7;">' +
                'Your configuration has been applied.<br>Click anywhere to launch Eaglercraft.<br>' +
                '<span style="color:#666;">This tab will close automatically after launch.</span>' +
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
              var progEl = document.getElementById('progressFill');
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

    try {
      probeProxyHealth = function() {
        try {
          var dot = document.getElementById('healthDot');
          var label = document.getElementById('healthLabel');
          if (dot) dot.className = 'health-dot load';
          if (label) label.textContent = 'Proxy: disabled in KA (CSP)';
        } catch(_) {}
      };
    } catch(_) {}
    try { _warmupDone = true; } catch(_) {}

    try { probeProxyHealth(); } catch(_) {}

    try {
      var retryBtn = document.getElementById('retryBtn');
      if (retryBtn) retryBtn.addEventListener('click', function () { try { window.location.reload(); } catch (_) {} });
    } catch (_) {}
    try {
      var copyBtn = document.getElementById('copyErrorsBtn');
      if (copyBtn) copyBtn.addEventListener('click', _copyErrorsToClipboard);
    } catch (_) {}
    _on('manualPasteBoxBtn', 'click', function () {
      var ta = document.getElementById('manualPasteBoxText');
      var val = (ta && ta.value) || '';
      val = val.trim();
      if (!val) {
        showToast('Paste Eaglercraft 1.12.2 XML source first', 'err');
        return;
      }
      showToast('Launching with pasted source (' + val.length + ' bytes)...', 'load');
      try {
        launchGame(val);
        logActivity('Manual paste launch: ' + val.length + ' bytes', 'ok');
      } catch (e) {
        try { if (window.__eaglerliteReportError) window.__eaglerliteReportError(e, 'manualPasteLaunch'); } catch (_) {}
        showToast('Launch failed: ' + ((e && e.message) || e), 'err');
      }
    });
    var _inSandbox = false;
    try {
      _inSandbox = (window.self !== window.top) ||
        (window.frameElement && window.frameElement.hasAttribute && window.frameElement.hasAttribute('sandbox'));
    } catch (_) { _inSandbox = true; }
    if (!_inSandbox) {
      try {
        fetchSourceWithFallbacks({
          timeout: 30000,
          onProgress: function (attempt, total, url) {
            try { setProgress(0.1 + 0.05 * attempt); setStatus('Verifying source ' + attempt + '/' + total + '...', 'load'); } catch (_) {}
          }
        }).then(function (text) {
          try { setStatus('Source verified - ready to launch', 'ok'); setProgress(0); } catch (_) {}
        }).catch(function (err) {
          try {
            setStatus('Source fetch failed - manual paste available', 'err');
            _revealManualPaste();
            logActivity('Source fetch failed: ' + (err && err.message ? err.message : String(err)), 'err');
          } catch (_) {}
        });
      } catch (_) {}
    } else {
      try { setStatus('Ready - click Launch Game to begin', 'ok'); } catch (_) {}
    }
    _hideBootstrapLoader();
  } catch (launcherErr) {
    try { if (window.__eaglerliteReportError) window.__eaglerliteReportError(launcherErr, 'launcher IIFE'); } catch (_) {}
    try {
      _showBootstrapError('Launcher failed: ' + (launcherErr && launcherErr.message ? launcherErr.message : String(launcherErr)));
      _hideBootstrapLoader();
    } catch (_) {}
  }
})();
