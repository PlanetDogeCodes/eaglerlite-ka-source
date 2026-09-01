/* EaglerLite v2.1 - KA Launcher JS
 * Loaded via <script src="https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-launcher.js">
 * inside Khan Academy's sandboxed webpage compiler iframe.
 * Vanilla ES5 (no transpilation). Vanilla 1.12.2 Eaglercraft runtime.
 */
(function () {
  'use strict';
  try { window.__eaglerliteLauncherVersion = 'v2.1'; window.__eaglerliteLauncherRuntime = '112'; } catch (_) {}
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

function EaglerLiteOptimizer(CFG) {
'use strict';
var _trapPropNames = [];
function _cleanupTraps() {
for (var i = 0; i < _trapPropNames.length; i++) {
try { delete Object.prototype[_trapPropNames[i]]; } catch(_) {}
}
_trapPropNames.length = 0;
}
try {
var S = { draws: 0 };
try {
window.addEventListener('error', function(e) {
try { console.error('[EaglerLite] Global error:', e.message, e.filename + ':' + e.lineno); } catch(_) {}
}, true);
window.addEventListener('unhandledrejection', function(e) {
try { console.error('[EaglerLite] Unhandled rejection:', e.reason); } catch(_) {}
}, true);
} catch(_) {}
try {
var _origWinAEL = window.addEventListener.bind(window);
window.addEventListener = function(type, listener, options) {
return _origWinAEL(type, listener, options);
};
var _origDocAEL = document.addEventListener.bind(document);
document.addEventListener = function(type, listener, options) {
return _origDocAEL(type, listener, options);
};
} catch(_) {}
try {
Object.defineProperty(window, 'onbeforeunload', {
configurable: true,
get: function() { return null; },
set: function() {}
});
} catch(_) {}
if (CFG.p9) {
var origAudioCtx = window.AudioContext || window.webkitAudioContext;
if (origAudioCtx) {
var WrappedAudioContext = function(opts) {
var finalOpts = Object.assign({}, opts || {}, { latencyHint: 'playback' });
try { return new origAudioCtx(finalOpts); } catch(e) { try { return new origAudioCtx(opts); } catch(e2) { return new origAudioCtx(); } }
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
gameCanvas.style.transform = on ? "scale(4)" : "scale(1)";
gameCanvas.style.transformOrigin = "center center";
gameCanvas.style.transition = "transform 0.15s ease";
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
try { console.log('[EaglerLite] Auto-detected sprint key:', detected); } catch(_) {}
} else {
try { console.log('[EaglerLite] Sprint key auto-detect: no saved keybinds found yet, using fallback:', sprintState.code); } catch(_) {}
}
try {
window.addEventListener('storage', function(e) {
var d = autoDetectSprintKey();
if (d && d !== sprintState.code) {
sprintState.code = d;
resolveSprintKey();
try { console.log('[EaglerLite] Sprint key updated via storage event:', d); } catch(_) {}
}
});
} catch(_) {}
try {
var _sprintKeyDetected = false;
var _lastNonMoveKey = null;
window.addEventListener('keydown', function(e) {
if (!isPLActive() || _sprintKeyDetected || !sprintBindingCaptured) return;
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
try { console.log('[EaglerLite] Sprint key auto-detected via gameplay observation:', candidate); } catch(_) {}
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
try { console.log('[EaglerLite] Sprint key updated via poll:', d); } catch(_) {}
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
try { console.log('[EaglerLite] AutoSprint: captured sprint binding via ' + propName); } catch(_) {}
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
try { console.log('[EaglerLite] AutoSprint ready (trap + W-detect + periodic re-fire)'); } catch(_) {}
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
wrap('generateMipmap', function(orig) { return function(target) {}; });
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
if (meta && data.byteLength <= meta.size) {
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
try { console.log('[EaglerLite] WebGL context restored, optimizer state re-initialized'); } catch(_) {}
} catch(restoreErr) {
try { console.error('[EaglerLite] Context restore error (non-fatal):', restoreErr); } catch(_) {}
}
});
}
if (CFG.fullbright && CFG.gameVersion === '1.12.2') {
var fbOrigShaderSource = gl.shaderSource.bind(gl);
gl.shaderSource = function(shader, source) {
if (typeof source === 'string' && source.indexOf('u_samplerLightmap') !== -1) {
var modified = source.replace(
/color\s*\*=\s*(?:EAGLER_TEXTURE_2D|texture)\s*\(\s*u_samplerLightmap\b[^;]*;/gi,
'color *= vec4(1.0, 1.0, 1.0, 1.0);'
);
if (modified !== source) {
try { console.log('[EaglerLite] Fullbright: patched fragment shader (lightmap → white)'); } catch(_) {}
source = modified;
}
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
try { console.log('[EaglerLite] Fullbright: identified lightmap texture (16x16 object on unit ' + (fbActiveUnit - 0x84C0) + ')'); } catch(_) {}
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
try { console.log('[EaglerLite] Fullbright: identified lightmap texture via frequency fallback (5 updates on unit ' + (fbActiveUnit - 0x84C0) + ')'); } catch(_) {}
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
try { console.log('[EaglerLite] Fullbright state cleared after context restore'); } catch(_) {}
});
}
}
return gl;
}
var _getCtx = HTMLCanvasElement.prototype.getContext;
HTMLCanvasElement.prototype.getContext = function(type, opts) {
if (CFG.p1 && (type === 'webgl' || type === 'webgl2' || type === 'experimental-webgl')) {
opts = Object.assign({}, opts, { antialias: false, powerPreference: 'high-performance' });
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
function escapeXml(s) {
return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
try {
if (CFG.tabName) {
document.title = CFG.tabName;
setTimeout(function() { document.title = CFG.tabName; }, 6000);
var titleEl = document.querySelector('title');
if (!titleEl) { titleEl = document.createElement('title'); document.head.appendChild(titleEl); }
var cloakObserver = new MutationObserver(function() {
if (document.title !== CFG.tabName) document.title = CFG.tabName;
});
cloakObserver.observe(titleEl, { childList: true, characterData: true, subtree: true });
setInterval(function() {
if (document.title !== CFG.tabName) document.title = CFG.tabName;
}, 5000);
}
if (CFG.favicon) {
var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
link.rel = 'icon';
var fav = CFG.favicon;
if (/^https?:\/\//i.test(fav) || fav.startsWith('data:') || fav.startsWith('/')) { link.href = fav; }
else {
var svg = "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text x='50' y='78' text-anchor='middle' font-size='80'>" + escapeXml(fav) + "</text></svg>";
link.href = 'data:image/svg+xml,' + encodeURIComponent(svg);
}
document.head.appendChild(link);
}
} catch(e) {}
try {
setTimeout(function() {
try {
var optScript = document.getElementById('eaglerlite-optimizer');
if (optScript && optScript.parentNode) {
optScript.parentNode.removeChild(optScript);
}
} catch(_) {}
}, 2000);
try {
  Object.defineProperty(window, 'opener', {
    configurable: true,
    get: function() { return null; },
    set: function() {}
  });
} catch(_) {
  try { window.opener = null; } catch(_) {}
}
try {
Object.defineProperty(document, 'referrer', {
configurable: true,
get: function() { return ''; }
});
} catch(_) {}
if (CFG.panicLink && CFG.panicKey) {
var panicKey = CFG.panicKey;
var panicLink = CFG.panicLink;
var panicTriggered = false;
function triggerPanic() {
if (panicTriggered) return;
panicTriggered = true;
try {
var w = window.open(panicLink, '_blank');
if (w) { try { w.focus(); } catch(_) {} }
} catch(_) {}
try { window.open('', '_self', ''); window.close(); } catch(_) {}
setTimeout(function() {
try { window.location.href = panicLink; } catch(_) {}
try { window.close(); } catch(_) {}
}, 50);
}
window.addEventListener('keydown', function(e) {
if (e.repeat) return;
var pk = panicKey.toLowerCase();
var code = (e.code || '').toLowerCase();
var key = (e.key || '').toLowerCase();
if (code === pk || key === pk) triggerPanic();
});
}
} catch(_) {}
if (CFG.hud) {
var hud = document.createElement('div');
Object.assign(hud.style, { position: 'fixed', top: '4px', left: '4px', background: 'rgba(0,0,0,0.65)', color: '#ffffff', font: 'bold 11px/1.9 "Courier New",monospace', padding: '5px 11px', borderRadius: '4px', zIndex: '999999', pointerEvents: 'none', userSelect: 'none', whiteSpace: 'pre', border: '1px solid rgba(255,255,255,0.15)', letterSpacing: '0.02em' });
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
try { console.log('[EaglerLite] Crystal Optimizer: captured Minecraft instance via ' + propName + ' (total: ' + capturedInstances.length + ')'); } catch(_) {}
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
try { console.log('[EaglerLite] Crystal Optimizer: named cooldown fields not found after 60s, falling back to heuristic scan'); } catch(_) {}
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
try { console.log('[EaglerLite] Crystal Optimizer: starting heuristic field scan (hard timeout: 5 min)'); } catch(_) {}
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
if (heuristicCandidates.size > 0) {
try { console.log('[EaglerLite] Crystal Optimizer: heuristic scan timed out after ' + Math.round(elapsed / 1000) + 's, ' + scanCount + ' iterations. ' + heuristicCandidates.size + ' unconfirmed candidates discarded.'); } catch(_) {}
} else {
try { console.log('[EaglerLite] Crystal Optimizer: heuristic scan completed after ' + Math.round(elapsed / 1000) + 's, no cooldown fields detected.'); } catch(_) {}
}
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
try { console.log('[EaglerLite] Crystal Optimizer: heuristic detected cooldown field: ' + trackKey + ' (values: ' + track.values.join(',') + ')'); } catch(_) {}
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
try { console.log('[EaglerLite] Crystal Optimizer: heuristic override applied to field: ' + fieldName); } catch(_) {}
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
try { console.log('[EaglerLite] Auto-Reconnect ready (delay=' + _arState.delayMs + 'ms, retries=' + _arState.maxRetries + ')'); } catch(_) {}
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
try { console.log('[EaglerLite] Auto-Reconnect: max retries (' + _arState.maxRetries + ') reached, giving up'); } catch(_) {}
return;
}
var uri = _arGetLastServerURI();
if (!uri) {
try { console.log('[EaglerLite] Auto-Reconnect: no last server URI stored, cannot reconnect'); } catch(_) {}
return;
}
_arCancelPending();
_arState.retryCount++;
var backoffDelay = _arState.delayMs;
if (_arState.retryCount > 1) {
backoffDelay = _arState.delayMs * Math.pow(1.5, _arState.retryCount - 1);
}
try { console.log('[EaglerLite] Auto-Reconnect: scheduling attempt ' + _arState.retryCount + '/' + _arState.maxRetries + ' in ' + backoffDelay + 'ms'); } catch(_) {}
_arState.pendingTimer = setTimeout(function() {
_arState.pendingTimer = null;
if (_arState.cancelled) return;
if (_arState.connected) {
try { console.log('[EaglerLite] Auto-Reconnect: already connected, skipping'); } catch(_) {}
return;
}
_arDoReconnect();
}, backoffDelay);
}
function _arDoReconnect() {
var uri = _arGetLastServerURI();
if (!uri) {
try { console.log('[EaglerLite] Auto-Reconnect: no URI, cannot reconnect'); } catch(_) {}
return;
}
try { console.log('[EaglerLite] Auto-Reconnect: triggering reconnect to ' + uri); } catch(_) {}
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
try { console.log('[EaglerLite] Auto-Reconnect: cannot trigger programmatically — user must reconnect manually'); } catch(_) {}
}
function _arOnScreenChange(screenName) {
try {
if (typeof screenName !== 'string') return;
if (screenName === 'net.minecraft.client.gui.GuiDisconnected') {
if (_arState.manualDisconnectPending) {
try { console.log('[EaglerLite] Auto-Reconnect: manual disconnect detected, not reconnecting'); } catch(_) {}
_arState.manualDisconnectPending = false;
return;
}
if (_arState.lastScreen === 'net.minecraft.client.gui.GuiIngameMenu') {
try { console.log('[EaglerLite] Auto-Reconnect: pause menu → disconnect = manual, not reconnecting'); } catch(_) {}
return;
}
_arState.connected = false;
_arScheduleReconnect();
} else if (screenName === 'net.minecraft.client.gui.GuiIngameMenu') {
_arState.manualDisconnectPending = true;
try { console.log('[EaglerLite] Auto-Reconnect: pause menu opened (manual disconnect pending)'); } catch(_) {}
} else if (screenName === 'net.minecraft.client.multiplayer.GuiConnecting' || screenName === 'net.minecraft.client.gui.GuiConnecting') {
_arCancelPending();
_arState.connected = false;
try { console.log('[EaglerLite] Auto-Reconnect: connecting screen detected, cancelled pending reconnect'); } catch(_) {}
} else if (screenName === 'net.minecraft.client.multiplayer.GuiWorldSelection' || screenName === 'net.minecraft.client.gui.GuiMainMenu' || screenName === 'net.minecraft.client.gui.GuiMultiplayer') {
_arCancelPending();
_arState.cancelled = true;
try { console.log('[EaglerLite] Auto-Reconnect: user navigated to menu, auto-reconnect cancelled'); } catch(_) {}
} else if (screenName === 'net.minecraft.client.gui.GuiIngame' || screenName === 'net.minecraft.client.multiplayer.GuiIngame') {
_arState.connected = true;
_arState.cancelled = false;
_arState.retryCount = 0;
_arState.manualDisconnectPending = false;
try { console.log('[EaglerLite] Auto-Reconnect: in-game, reset state'); } catch(_) {}
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
try { console.error('[EaglerLite] Optimizer error (game will continue without optimizations):', optimizerErr); } catch(_) {}
_cleanupTraps();
}
}

    function buildKASrcdoc(cfg, opts) {
      opts = opts || {};
      var stripReferrer = opts.stripReferrer !== false;
      var refMeta = stripReferrer ? '<meta name="referrer" content="no-referrer">\n' : '';

      var cfgJson = JSON.stringify(cfg).replace(/<\/script>/gi, '<\\/script>');
      var optiCode = '(' + EaglerLiteOptimizer.toString() + ')(' + cfgJson + ');';
      var safeOptiCode = optiCode.replace(/<\/script>/gi, '<\\/script>');
      var chunkAUrl = 'https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-client-a.js?v=2.1';
      var chunkBUrl = 'https://cdn.jsdelivr.net/gh/PlanetDogeCodes/eaglerlite-ka-source@main/eaglerlite-ka-client-b.js?v=2.1';

      var parts = [
        '<!DOCTYPE html>\n',
        '<html>\n<head>\n',
        '<title>' + escapeHtml(opts.tabName || 'EaglerLite 1.12.2') + '</title>\n',
        '<meta charset="UTF-8">\n',
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n',
        refMeta,
        '<style>html,body{margin:0;padding:0;width:100vw;height:100vh;overflow:hidden;background:#000000}#game_frame{width:100%;height:100%}#toastStack{position:fixed;bottom:8px;left:50%;transform:translateX(-50%);z-index:100000001;display:flex;flex-direction:column-reverse;pointer-events:none;max-width:90vw}.toast-item{margin-top:4px;background:#222;color:#eee;padding:6px 12px;border-radius:6px;font:13px monospace;opacity:0;transition:opacity .2s;max-width:90vw}.toast-item.show{opacity:1}.toast-item.err{background:#400;border:1px solid #f55}.toast-item.ok{background:#040;border:1px solid #5f5}</style>\n',
        '</head>\n',
        '<body>\n',
        '<div id="game_frame"></div>\n',
        '<div id="toastStack"></div>\n',
        '<scr' + 'ipt>\n',
        '(function(){\n',
        '  try {\n',
        '  try { eval("function KAInfiniteLoopProtect(){}"); } catch(e) {}\n',
        '  function toast(m,k){var s=document.getElementById("toastStack");if(!s){try{console.log("[KA]",m);}catch(_){}return;}var t=document.createElement("div");t.className="toast-item "+(k||"");t.textContent=String(m);s.appendChild(t);requestAnimationFrame(function(){t.classList.add("show")});setTimeout(function(){t.classList.remove("show");setTimeout(function(){if(t.parentNode)t.parentNode.removeChild(t)},300)},k==="err"?5000:2500)}\n',
        '  window.__eagToast = toast;\n',
        '  window.__eagFail = function(reason){ var r=String(reason); try { toast(r,"err"); } catch(_) {} try { window.parent.postMessage({type:"eaglerlite-fail",reason:r},"*"); } catch(_) {} };\n',
        '  window.__eagReadyDone = false;\n',
        '  window.__eagFireReady = function(){ if (window.__eagReadyDone) return; window.__eagReadyDone = true; try { if (window.__eagToast) window.__eagToast("Eaglercraft 1.12.2 ready","ok"); } catch(_) {} try { window.parent.postMessage({type:"eaglerlite-ready",gameVersion:"1.12.2"},"*"); } catch(_) {} };\n',
        '  var _origFetch = (typeof window.fetch === "function") ? window.fetch.bind(window) : null;\n',
        '  function _dataUriBytes(url){\n',
        '    var ci = url.indexOf(",");\n',
        '    if (ci === -1) throw new Error("malformed data URI");\n',
        '    var meta = url.slice(0, ci);\n',
        '    var payload = url.slice(ci + 1);\n',
        '    var bytes;\n',
        '    if (meta.indexOf("base64") !== -1) {\n',
        '      var bin = window.atob(payload);\n',
        '      bytes = new Uint8Array(bin.length);\n',
        '      for (var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);\n',
        '    } else {\n',
        '      var dec = window.decodeURIComponent(payload);\n',
        '      bytes = new Uint8Array(dec.length);\n',
        '      for (var j = 0; j < dec.length; j++) bytes[j] = dec.charCodeAt(j) & 255;\n',
        '    }\n',
        '    return bytes;\n',
        '  }\n',
        '  window.fetch = function(input, init){\n',
        '    var url = null;\n',
        '    try {\n',
        '      if (typeof input === "string") url = input;\n',
        '      else if (input && typeof input.url === "string") url = input.url;\n',
        '    } catch(_) {}\n',
        '    if (url && url.slice(0, 5) === "data:") {\n',
        '      return new Promise(function(resolve, reject){\n',
        '        try {\n',
        '          var bytes = _dataUriBytes(url);\n',
        '          var mime = url.slice(5, url.indexOf(";")) || "application/octet-stream";\n',
        '          if (typeof Response === "function") resolve(new Response(bytes.buffer, { status: 200, statusText: "OK", headers: { "content-type": mime } }));\n',
        '          else resolve({ ok: true, status: 200, arrayBuffer: function(){ return Promise.resolve(bytes.buffer); } });\n',
        '        } catch (e) { reject(e); }\n',
        '      });\n',
        '    }\n',
        '    if (!_origFetch) return Promise.reject(new Error("fetch unavailable"));\n',
        '    return _origFetch(input, init);\n',
        '  };\n',
        '  var _origCOU = (typeof URL !== "undefined" && URL.createObjectURL) ? URL.createObjectURL : null;\n',
        '  if (_origCOU) {\n',
        '    window.__eagBlobMap = {};\n',
        '    URL.createObjectURL = function(blob){\n',
        '      var u = _origCOU.call(URL, blob);\n',
        '      try { window.__eagBlobMap[u] = blob; } catch(_) {}\n',
        '      return u;\n',
        '    };\n',
        '  }\n',
        '  var _origROU = (typeof URL !== "undefined" && URL.revokeObjectURL) ? URL.revokeObjectURL : null;\n',
        '  if (_origROU) {\n',
        '    URL.revokeObjectURL = function(u){\n',
        '      try { if (window.__eagBlobMap) delete window.__eagBlobMap[u]; } catch(_) {}\n',
        '      return _origROU.call(URL, u);\n',
        '    };\n',
        '  }\n',
        '  var _origOpen = XMLHttpRequest.prototype.open;\n',
        '  var _origSend = XMLHttpRequest.prototype.send;\n',
        '  XMLHttpRequest.prototype.open = function(method, url){\n',
        '    try { this.__eagReqUrl = String(url); } catch(_) {}\n',
        '    return _origOpen.apply(this, arguments);\n',
        '  };\n',
        '  XMLHttpRequest.prototype.send = function(){\n',
        '    var u = null;\n',
        '    try { u = this.__eagReqUrl; } catch(_) {}\n',
        '    if (u && u.slice(0, 5) === "data:") {\n',
        '      var self = this;\n',
        '      setTimeout(function(){\n',
        '        try {\n',
        '          var bytes = _dataUriBytes(u);\n',
        '          try { Object.defineProperty(self, "response", { value: bytes.buffer, configurable: true }); } catch(_) {}\n',
        '          try { Object.defineProperty(self, "responseText", { value: "", configurable: true }); } catch(_) {}\n',
        '          try { Object.defineProperty(self, "status", { value: 200, configurable: true }); } catch(_) {}\n',
        '          self.dispatchEvent(new Event("load"));\n',
        '        } catch (e) { try { self.dispatchEvent(new Event("error")); } catch(_) {} }\n',
        '      }, 0);\n',
        '      return;\n',
        '    }\n',
        '    if (u && u.slice(0, 5) === "blob:") {\n',
        '      var self2 = this;\n',
        '      var bl = null;\n',
        '      try { bl = (window.__eagBlobMap || {})[u]; } catch(_) {}\n',
        '      if (bl) {\n',
        '        try {\n',
        '        var rd = new FileReader();\n',
        '        rd.addEventListener("loadend", function(){\n',
        '          try {\n',
        '            var res = rd.result;\n',
        '            try { Object.defineProperty(self2, "response", { value: res, configurable: true }); } catch(_) {}\n',
        '            try { Object.defineProperty(self2, "status", { value: 200, configurable: true }); } catch(_) {}\n',
        '            self2.dispatchEvent(new Event("load"));\n',
        '          } catch(_) { try { self2.dispatchEvent(new Event("error")); } catch(_) {} }\n',
        '        });\n',
        '        rd.addEventListener("error", function(){ try { self2.dispatchEvent(new Event("error")); } catch(_) {} });\n',
        '        rd.readAsArrayBuffer(bl);\n',
        '        return;\n',
        '        } catch(_) { setTimeout(function(){ try { self2.dispatchEvent(new Event("error")); } catch(_) {} }, 0); return; }\n',
        '      }\n',
        '      setTimeout(function(){ try { self2.dispatchEvent(new Event("error")); } catch(_) {} }, 0);\n',
        '      return;\n',
        '    }\n',
        '    return _origSend.apply(this, arguments);\n',
        '  };\n',
        '  var _origSetAttr = Element.prototype.setAttribute;\n',
        '  Element.prototype.setAttribute = function(name, value){\n',
        '    try {\n',
        '      if ((name === "src" || name === "href") && typeof value === "string" && value.slice(0, 11) === "data:image/") {\n',
        '        return;\n',
        '      }\n',
        '    } catch(_) {}\n',
        '    return _origSetAttr.apply(this, arguments);\n',
        '  };\n',
        '  try {\n',
        '    var _linkDesc = Object.getOwnPropertyDescriptor(HTMLLinkElement.prototype, "href");\n',
        '    if (_linkDesc && _linkDesc.get && _linkDesc.set) {\n',
        '      Object.defineProperty(HTMLLinkElement.prototype, "href", {\n',
        '        get: function(){ return _linkDesc.get.call(this); },\n',
        '        set: function(v){ if (typeof v === "string" && v.slice(0, 11) === "data:image/") return; _linkDesc.set.call(this, v); }\n',
        '      });\n',
        '    }\n',
        '  } catch(_) {}\n',
        '  try {\n',
        '    var _imgDesc = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");\n',
        '    if (_imgDesc && _imgDesc.get && _imgDesc.set) {\n',
        '      Object.defineProperty(HTMLImageElement.prototype, "src", {\n',
        '        get: function(){ return _imgDesc.get.call(this); },\n',
        '        set: function(v){ if (typeof v === "string" && v.slice(0, 11) === "data:image/") return; _imgDesc.set.call(this, v); }\n',
        '      });\n',
        '    }\n',
        '  } catch(_) {}\n',
        '  function _canvasImgLoad(cv, url){\n',
        '    try {\n',
        '      var blob = null;\n',
        '      if (url.slice(0, 5) === "blob:") {\n',
        '        try { blob = (window.__eagBlobMap || {})[url]; } catch(_) {}\n',
        '      } else if (url.slice(0, 11) === "data:image/") {\n',
        '        var bytes = _dataUriBytes(url);\n',
        '        var ci = url.indexOf(",");\n',
        '        var meta = url.slice(0, ci);\n',
        '        var semi = meta.indexOf(";");\n',
        '        var mime = semi > 5 ? meta.slice(5, semi) : "image/png";\n',
        '        blob = new Blob([bytes], { type: mime });\n',
        '      }\n',
        '      if (!blob) { setTimeout(function(){ try { cv.dispatchEvent(new Event("error")); } catch(_) {} }, 0); return; }\n',
        '      var done = false;\n',
        '      var fail = function(){ if (done) return; done = true; try { cv.dispatchEvent(new Event("error")); } catch(_) {} };\n',
        '      var ok = function(bitmap){\n',
        '        if (done) return; done = true;\n',
        '        try {\n',
        '          cv.width = bitmap.width; cv.height = bitmap.height;\n',
        '          try { Object.defineProperty(cv, "naturalWidth", { value: bitmap.width, configurable: true }); } catch(_) {}\n',
        '          try { Object.defineProperty(cv, "naturalHeight", { value: bitmap.height, configurable: true }); } catch(_) {}\n',
        '          try { Object.defineProperty(cv, "complete", { value: true, configurable: true }); } catch(_) {}\n',
        '          var ctx = cv.getContext("2d");\n',
        '          ctx.drawImage(bitmap, 0, 0);\n',
        '          cv.dispatchEvent(new Event("load"));\n',
        '        } catch (e) { fail(); }\n',
        '      };\n',
        '      if (typeof window.createImageBitmap === "function") {\n',
        '        window.createImageBitmap(blob).then(ok, fail);\n',
        '      } else {\n',
        '        var turl = _origCOU ? _origCOU.call(URL, blob) : null;\n',
        '        var im = (_origCreate ? _origCreate("img") : null);\n',
        '        if (turl && im) {\n',
        '          im.onload = function(){ try { cv.width = im.naturalWidth; cv.height = im.naturalHeight; var c2 = cv.getContext("2d"); c2.drawImage(im, 0, 0); cv.dispatchEvent(new Event("load")); } catch (e) { fail(); } };\n',
        '          im.onerror = fail;\n',
        '          im.src = turl;\n',
        '        } else { fail(); }\n',
        '      }\n',
        '    } catch (e) { try { cv.dispatchEvent(new Event("error")); } catch(_) {} }\n',
        '  }\n',
        '  function _installCanvasImage(cv){\n',
        '    try { cv.width = 0; cv.height = 0; } catch(_) {}\n',
        '    try {\n',
        '      Object.defineProperty(cv, "src", {\n',
        '        configurable: true,\n',
        '        get: function(){ return cv.__eagImgSrc || ""; },\n',
        '        set: function(v){ cv.__eagImgSrc = String(v); _canvasImgLoad(cv, String(v)); }\n',
        '      });\n',
        '    } catch(_) {}\n',
        '  }\n',
        '  var _origCreate = document.createElement.bind(document);\n',
        '  document.createElement = function(tag){\n',
        '    if (String(tag).toLowerCase() === "img") {\n',
        '      var cv = _origCreate("canvas");\n',
        '      _installCanvasImage(cv);\n',
        '      return cv;\n',
        '    }\n',
        '    return _origCreate(tag);\n',
        '  };\n',
        '  window.eaglercraftXOpts = {\n',
        '    container: "game_frame",\n',
        '    worldsDB: "worlds",\n',
        '    singleThreadMode: true,\n',
        '    relays: [],\n',
        '    servers: [],\n',
        '    hooks: {\n',
        '      screenChanged: function(screenName, sw, sh, rw, rh, scale){\n',
        '        try {\n',
        '          if (typeof screenName === "string" && (screenName.indexOf("GuiMainMenu") !== -1 || screenName.indexOf("GuiScreenEditProfile") !== -1)) window.__eagFireReady();\n',
        '        } catch(_) {}\n',
        '      }\n',
        '    }\n',
        '  };\n',
        '  try { window.eaglerLiteCfg = ' + cfgJson + '; } catch(e) {}\n',
        '  } catch(_setupErr) { try { window.parent.postMessage({type:"eaglerlite-fail",reason:"setup error: "+((_setupErr&&_setupErr.message)?_setupErr.message:String(_setupErr))},"*"); } catch(_) {} }\n',
        '})();\n',
        '</scr' + 'ipt>\n',
        '<scr' + 'ipt id="eaglerlite-optimizer">' + safeOptiCode + '</scr' + 'ipt>\n',
        '<scr' + 'ipt src="' + chunkAUrl + '"></scr' + 'ipt>\n',
        '<scr' + 'ipt src="' + chunkBUrl + '"></scr' + 'ipt>\n',
        '<scr' + 'ipt>\n',
        '(function(){\n',
        '  try {\n',
        '  var fail = function(r){ try { if (window.__eagFail) window.__eagFail(r); } catch(_) {} };\n',
        '  if (typeof window.main !== "function") { fail("client code chunk failed to load (eaglerlite-ka-client-a.js not published on the CDN repo yet)"); return; }\n',
        '  if (typeof window.__eag112Assets !== "string" || !window.__eag112Assets) { fail("game assets chunk failed to load (eaglerlite-ka-client-b.js not published on the CDN repo yet)"); return; }\n',
        '  if (!window.eaglercraftXOpts || typeof window.eaglercraftXOpts !== "object") { fail("launch options missing"); return; }\n',
        '  window.eaglercraftXOpts.assetsURI = window.__eag112Assets;\n',
        '  window.__eag112Assets = null;\n',
        '  try { window.main(); } catch(e) { fail("main() error: " + ((e&&e.message)||e)); return; }\n',
        '  var tries = 0;\n',
        '  var poll = setInterval(function(){\n',
        '    tries++;\n',
        '    try {\n',
        '      if (window.__eagReadyDone) { clearInterval(poll); return; }\n',
        '      if (tries >= 300) { clearInterval(poll); fail("game did not reach the title screen within 150 seconds"); }\n',
        '    } catch(e) { clearInterval(poll); fail("render check error: " + ((e&&e.message)||e)); }\n',
        '  }, 500);\n',
        '  } catch(_bootErr) { try { window.parent.postMessage({type:"eaglerlite-fail",reason:"boot error: "+((_bootErr&&_bootErr.message)?_bootErr.message:String(_bootErr))},"*"); } catch(_) {} }\n',
        '})();\n',
        '</scr' + 'ipt>\n',
        '</body>\n</html>\n'
      ];
      return parts.join('');
    }

function launchGame(pastedContent) {
      if (pastedContent && typeof pastedContent !== 'string') pastedContent = null;
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
          reconnectDelay: parseInt(document.getElementById('reconnectDelay').value.trim(), 10) || 2500,
          reconnectRetries: parseInt(document.getElementById('reconnectRetries').value.trim(), 10) || 1,
          maxFPS: parseInt(document.getElementById('maxFPS').value.trim(), 10) || 120
        };
        try { localStorage.setItem('eaglerLiteLastLaunch_v2', JSON.stringify(cfg)); } catch(_) {}
        setProgress(0.3); setStatus((pastedContent && typeof pastedContent === 'string') ? 'Building KA game frame from pasted source...' : 'Building KA game frame...', 'load');
        var srcdoc;
        if (pastedContent && typeof pastedContent === 'string') {
          var _readyScript = '</scr' + 'ipt><scr' + 'ipt>(function(){try{var n=0;var p=setInterval(function(){n++;try{if(window.__eagPastedReady){clearInterval(p);return}var c=document.querySelector("#game_frame canvas");if(c&&c.width>0){clearInterval(p);window.__eagPastedReady=true;try{window.parent.postMessage({type:"eaglerlite-ready",gameVersion:"1.12.2"},"*")}catch(e){}}else if(n>=300){clearInterval(p);try{window.parent.postMessage({type:"eaglerlite-fail",reason:"pasted source did not render the game within 150 seconds"},"*")}catch(e){}}}catch(e){}},500)}catch(_rErr){try{window.parent.postMessage({type:"eaglerlite-fail",reason:"readiness error: "+((_rErr&&_rErr.message)?_rErr.message:String(_rErr))},"*")}catch(_){}}})()</scr' + 'ipt>';
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
          setStatus('Still loading 1.12.2... (slow device or CDN) - the game opens when ready', 'load');
          logActivity('Launch slow: no handshake after 100s (continuing to wait)', 'load');
        }, 100000));
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
    try { window.launchGame = launchGame; } catch (_) {}

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
      if (theme !== 'dark') theme = 'dark';
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
          var autoStyles = {
            position: 'fixed', top: '0', left: '0', width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.95)', zIndex: '99999', display: 'flex',
            flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', userSelect: 'none', fontFamily: "'Courier New', monospace"
          };
          var k;
          for (k in autoStyles) {
            if (Object.prototype.hasOwnProperty.call(autoStyles, k)) overlay.style[k] = autoStyles[k];
          }
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
        fetch('https://data.jsdelivr.com/v1/package/gh/PlanetDogeCodes/eaglerlite-ka-source@main/flat', { cache: 'no-store' })
          .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
          .then(function (d) {
            var sizes = {};
            try {
              var files = (d && d.files) || [];
              for (var fi = 0; fi < files.length; fi++) {
                var fname = String(files[fi].name || '');
                if (fname.charAt(0) === '/') fname = fname.slice(1);
                sizes[fname] = files[fi].size;
              }
            } catch (_) {}
            var sizeA = sizes['eaglerlite-ka-client-a.js'];
            var sizeB = sizes['eaglerlite-ka-client-b.js'];
            if (typeof sizeA === 'number' && sizeA > 10000000 && typeof sizeB === 'number' && sizeB > 10000000) {
              try { setStatus('Source verified - Eaglercraft 1.12.2 ready', 'ok'); setProgress(0); } catch (_) {}
            } else {
              try { setStatus('Client chunks not published on the repo yet - push both chunk files', 'err'); logActivity('CDN repo check: 1.12.2 chunks missing (a=' + sizeA + ' b=' + sizeB + ')', 'err'); } catch (_) {}
            }
          })
          .catch(function (err) {
            try { setStatus('CDN check unavailable - launch will verify anyway', 'load'); } catch (_) {}
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
