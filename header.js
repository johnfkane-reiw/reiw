/* REIW shared header — header.js v1.2
   Usage on a gated page:
     <div id="reiw-header"></div>
     <script>window.REIW_HEADER = { label:'Rental Studio', badge:'RENTAL', version:'v3.10', guide:true };</script>
     <script src="/header.js"></script>
   Renders the navy bar + the Playfair-28 page label, and runs the auth + name gate.
   Config: label (string), badge (string|omit), version (e.g. 'v3.10'), guide (bool),
           api (optional worker base), content (optional CSS selector for the page-label host). */
(function () {
  var cfg = window.REIW_HEADER || {};
  var API = cfg.api || 'https://reiw-worker.reiw.app';
  // Copyright holder for the About dialog. Single override point = window.REIW_ENTITY
  // (also used by footer.js); falls back to the literal below.
  var ENTITY = window.REIW_ENTITY || 'VectorSprint LLC';
  var mount = document.getElementById('reiw-header');
  if (!mount) return;

  // ── Styles (scoped with reiwh- prefix; bar matches the legacy in-app header) ──
  var css = ''
    + '.reiwh-bar{background:#1a2744;height:52px;padding:0 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:1000;box-shadow:0 2px 8px rgba(0,0,0,0.25)}'
    + '.reiwh-left{display:flex;align-items:center;gap:12px}'
    + '.reiwh-right{display:flex;align-items:center;gap:14px}'
    + '.reiwh-logobtn{display:flex;align-items:center;gap:10px;text-decoration:none}'
    + '.reiwh-logo{font-family:\'Playfair Display\',Georgia,serif;font-size:20px;font-weight:900;color:#fff}'
    + '.reiwh-badge{font-size:11px;font-weight:700;background:rgba(196,151,59,0.15);color:#e2b96a;border:1px solid rgba(196,151,59,0.3);padding:3px 9px;border-radius:5px;letter-spacing:0.07em}'
    + '.reiwh-vpill{font-size:11px;color:rgba(255,255,255,0.72);font-weight:500}'
    + '.reiwh-navlink{font-size:13px;color:rgba(255,255,255,0.7);text-decoration:none;padding:6px 12px;border-radius:6px;cursor:pointer}'
    + '.reiwh-navlink:hover{background:rgba(255,255,255,0.1);color:#fff}'
    + '.reiwh-user{font-size:13px;color:rgba(255,255,255,0.85);font-weight:500;white-space:nowrap}'
    + '.reiwh-gearwrap{position:relative}'
    + '.reiwh-gear{display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:7px;background:transparent;border:none;color:rgba(255,255,255,0.8);cursor:pointer}'
    + '.reiwh-gear:hover{background:rgba(255,255,255,0.1);color:#fff}'
    + '.reiwh-menu{position:absolute;top:40px;right:0;min-width:210px;background:#fff;border:1px solid #e4e7ec;border-radius:10px;box-shadow:0 8px 28px rgba(16,24,40,0.16);padding:6px;z-index:1001}'
    + '.reiwh-menu[hidden]{display:none}'
    + '.reiwh-mi{display:block;width:100%;text-align:left;background:none;border:none;font:inherit;font-size:14px;color:#374151;padding:9px 12px;border-radius:7px;cursor:pointer;text-decoration:none}'
    + '.reiwh-mi:hover{background:#f3f6fb}'
    + '.reiwh-sep{height:1px;background:#eef0f5;margin:6px 4px}'
    + '.reiwh-mlabel{font-size:11px;font-weight:700;color:#8896aa;letter-spacing:.5px;text-transform:uppercase;padding:6px 12px 4px}'
    + '.reiwh-trow{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:7px;cursor:pointer}'
    + '.reiwh-trow:hover{background:#f3f6fb}'
    + '.reiwh-ticon{width:24px;height:24px;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:#fff;flex-shrink:0}'
    + '.reiwh-tname{font-size:13px;color:#374151}'
    + '.reiwh-logout{color:#b23b3b}'
    + '.reiwh-pagelabel{font-family:\'Playfair Display\',Georgia,serif;font-size:28px;font-weight:700;color:#1a2744;line-height:1.1;margin:0}'
    + '.reiwh-pagehead{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:2px 0 18px}'
    + '.reiwh-dashlink{font-size:13px;font-weight:600;color:#2554c7;text-decoration:none;white-space:nowrap;flex-shrink:0}'
    + '.reiwh-dashlink:hover{text-decoration:underline}'
    + '.reiwh-overlay{position:fixed;inset:0;background:rgba(16,24,40,0.55);display:flex;align-items:center;justify-content:center;z-index:2000;padding:20px}'
    + '.reiwh-overlay[hidden]{display:none}'
    + '.reiwh-modal{background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(16,24,40,0.3);max-width:380px;width:100%;padding:28px 28px 24px;position:relative;text-align:center}'
    + '.reiwh-modal-x{position:absolute;top:12px;right:14px;background:none;border:none;font-size:20px;line-height:1;color:#9aa3b2;cursor:pointer}'
    + '.reiwh-modal-x:hover{color:#374151}'
    + '.reiwh-modal-logo{font-family:\'Playfair Display\',Georgia,serif;font-size:30px;font-weight:900;color:#1a2744;margin-bottom:2px}'
    + '.reiwh-modal-ver{font-size:12px;color:#8896aa;margin-bottom:18px}'
    + '.reiwh-modal-links{display:flex;gap:18px;justify-content:center;margin-bottom:16px}'
    + '.reiwh-modal-links a{font-size:13px;font-weight:600;color:#2554c7;text-decoration:none}'
    + '.reiwh-modal-links a:hover{text-decoration:underline}'
    + '.reiwh-modal-copy{font-size:12px;color:#9aa3b2;border-top:1px solid #eef0f5;padding-top:14px}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  // ── Bar markup ──
  var logoSVG = '<svg width="28" height="18" viewBox="0 0 56 36" fill="none" style="flex-shrink:0"><polyline points="2,34 13,8 23,21 34,2 45,15 54,5" stroke="rgba(255,255,255,0.5)" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="34,2 45,15 54,5" stroke="#c4973b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="2" r="4" fill="#c4973b"/></svg>';
  var gearSVG = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>';

  function esc(s) { var d = document.createElement('div'); d.textContent = s == null ? '' : s; return d.innerHTML; }

  var badgeHTML = cfg.badge ? '<span class="reiwh-badge">' + esc(cfg.badge) + '</span>' : '';
  var vpillText = [cfg.label, cfg.version].filter(Boolean).join(' ');
  var guideHTML = cfg.guide ? '<a class="reiwh-navlink" id="reiwh-guide">Guide</a>' : '';

  mount.innerHTML =
    '<div class="reiwh-bar">' +
      '<div class="reiwh-left">' +
        '<a class="reiwh-logobtn" href="/dashboard.html" title="Dashboard">' + logoSVG + '<span class="reiwh-logo">REIW</span></a>' +
        badgeHTML +
        '<span class="reiwh-vpill">' + esc(vpillText) + '</span>' +
      '</div>' +
      '<div class="reiwh-right">' +
        guideHTML +
        '<span class="reiwh-user" id="reiwh-user"></span>' +
        '<div class="reiwh-gearwrap">' +
          '<button class="reiwh-gear" id="reiwh-gearbtn" aria-label="Menu">' + gearSVG + '</button>' +
          '<div class="reiwh-menu" id="reiwh-menu" hidden>' +
            '<a class="reiwh-mi" href="/settings.html">User Settings</a>' +
            '<a class="reiwh-mi" id="reiwh-admin" href="/admin.html" hidden>Admin</a>' +
            '<div id="reiwh-switch" hidden><div class="reiwh-sep"></div><div class="reiwh-mlabel">Switch account</div></div>' +
            '<div class="reiwh-sep"></div>' +
            '<button class="reiwh-mi" id="reiwh-about">About</button>' +
            '<button class="reiwh-mi reiwh-logout" id="reiwh-logout">Log Out</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>';

  // ── Page label into the content container (deferred until the host exists) ──
  function insertLabel() {
    if (!cfg.label || cfg.pageLabel === false) return;
    var host = document.querySelector(cfg.content || '.main, .app, [data-reiw-content]');
    if (!host) return;
    if (host.querySelector('.reiwh-pagehead')) return;
    var row = document.createElement('div');
    row.className = 'reiwh-pagehead';
    var h = document.createElement('h1');
    h.className = 'reiwh-pagelabel';
    h.textContent = cfg.label;
    row.appendChild(h);
    if (cfg.dashLink !== false) {
      var a = document.createElement('a');
      a.className = 'reiwh-dashlink';
      a.href = '/dashboard.html';
      a.textContent = '\u2190 Dashboard';
      row.appendChild(a);
    }
    host.insertBefore(row, host.firstChild);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', insertLabel);
  } else {
    insertLabel();
  }

  // ── Guide hook (calls the page's own drawer) ──
  if (cfg.guide) {
    var g = document.getElementById('reiwh-guide');
    if (g) g.addEventListener('click', function () { if (typeof window.openGuide === 'function') window.openGuide(); });
  }

  // ── Gear menu open/close ──
  var gearBtn = document.getElementById('reiwh-gearbtn');
  var menu = document.getElementById('reiwh-menu');
  gearBtn.addEventListener('click', function (e) { e.stopPropagation(); menu.hidden = !menu.hidden; });
  document.addEventListener('click', function (e) { if (!menu.hidden && !menu.contains(e.target) && e.target !== gearBtn) menu.hidden = true; });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') menu.hidden = true; });

  // ── About modal ──
  var modal = document.createElement('div');
  modal.className = 'reiwh-overlay';
  modal.hidden = true;
  modal.innerHTML =
    '<div class="reiwh-modal">' +
      '<button class="reiwh-modal-x" aria-label="Close">\u00d7</button>' +
      '<div class="reiwh-modal-logo">REIW</div>' +
      '<div class="reiwh-modal-ver">' + esc(vpillText) + '</div>' +
      '<div class="reiwh-modal-links">' +
        '<a href="/privacy.html" target="_blank" rel="noopener">Privacy Policy</a>' +
        '<a href="/terms.html" target="_blank" rel="noopener">Terms &amp; Conditions</a>' +
      '</div>' +
      '<div class="reiwh-modal-copy">\u00a9 ' + new Date().getFullYear() + ' ' + esc(ENTITY) + '</div>' +
    '</div>';
  document.body.appendChild(modal);
  function closeAbout() { modal.hidden = true; }
  document.getElementById('reiwh-about').addEventListener('click', function () { menu.hidden = true; modal.hidden = false; });
  modal.querySelector('.reiwh-modal-x').addEventListener('click', closeAbout);
  modal.addEventListener('click', function (e) { if (e.target === modal) closeAbout(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAbout(); });

  document.getElementById('reiwh-logout').addEventListener('click', function () {
    fetch(API + '/auth/logout', { method: 'POST', credentials: 'include' })
      .catch(function () {})
      .then(function () { window.location.href = '/'; });
  });

  function switchTo(tid) {
    fetch(API + '/auth/switch-tenant', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      credentials: 'include', body: JSON.stringify({ tenant_id: tid })
    }).then(function (r) { if (r.ok) window.location.href = '/dashboard.html'; });
  }

  // ── Auth + name gate, then populate ──
  (function init() {
    fetch(API + '/auth/me', { credentials: 'include' }).then(function (res) {
      if (!res.ok) { window.location.href = '/login.html'; return null; }
      return res.json();
    }).then(function (data) {
      if (!data) return;
      // Name gate via settings.
      fetch(API + '/api/settings', { credentials: 'include' }).then(function (sr) {
        return sr.ok ? sr.json() : {};
      }).catch(function () { return {}; }).then(function (s) {
        var fn = (s.first_name || '').trim(), ln = (s.last_name || '').trim();
        if (!fn || !ln) { window.location.href = '/complete-profile.html'; return; }

        var full = (fn + ' ' + ln).trim();
        document.getElementById('reiwh-user').textContent = full + ' (' + data.user.email + ')';

        var role = data.user && data.user.role;
        if (role === 'owner' || role === 'admin') {
          document.getElementById('reiwh-admin').hidden = false;
        }

        var others = (data.other_tenants || []);
        if (others.length) {
          var box = document.getElementById('reiwh-switch');
          box.hidden = false;
          others.forEach(function (t) {
            var color = t.primary_color || '#1a2744';
            var name = t.tenant_name || 'Account';
            var row = document.createElement('div');
            row.className = 'reiwh-trow';
            row.innerHTML = '<span class="reiwh-ticon" style="background:' + color + '">' + esc(name.charAt(0).toUpperCase()) + '</span><span class="reiwh-tname">' + esc(name) + '</span>';
            row.addEventListener('click', function () { switchTo(t.tenant_id); });
            box.appendChild(row);
          });
        }
      });
    }).catch(function () { window.location.href = '/login.html'; });
  })();
})();
