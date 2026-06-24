/* REIW marketing header — site-header.js v1.1
   The shared PUBLIC (pre-login) nav, rendered by this component (mirror of header.js
   for the app side). One source of truth for the marketing nav + its behavior.
   Usage (place at the very top of <body>):
     <div id="reiw-site-header"></div>
     <script>window.REIW_SITE_HEADER = { page: 'tools' };</script>
     <script src="/site-header.js"></script>
   Config: page ∈ 'home' | 'tools' | 'pricing'  (marks the current link active+disabled);
           api (optional worker base).
   Behavior:
   - Active page: the matching link is shown but disabled + active-styled (you-are-here).
   - Session flip (idempotent, re-runs on pageshow, cache:'no-store'): logged out → "Sign in"
     + "Get started free"; logged in → "Log Out" (+ hide "Get started free"). */
(function () {
  var cfg = window.REIW_SITE_HEADER || {};
  var API = cfg.api || 'https://reiw-worker.reiw.app';
  var mount = document.getElementById('reiw-site-header');
  if (!mount) return;

  var css = ''
    + '.reiwsh-nav{display:flex;align-items:center;justify-content:space-between;height:66px;padding:0 60px;background:#fff;border-bottom:1px solid #ece9e3}'
    + '.reiwsh-brand{display:flex;align-items:center;gap:13px;text-decoration:none}'
    + '.reiwsh-word{font-family:\'Playfair Display\',Georgia,serif;font-size:22px;font-weight:900;color:#1a2744;letter-spacing:-.015em}'
    + '.reiwsh-right{display:flex;align-items:center;gap:36px}'
    + '.reiwsh-link{font-size:14px;font-weight:500;color:#374151;text-decoration:none;cursor:pointer}'
    + '.reiwsh-link:hover{color:#1a2744}'
    + '.reiwsh-link.reiwsh-active{color:#1a2744;font-weight:700;cursor:default;pointer-events:none}'
    + '.reiwsh-div{width:1px;height:18px;background:#e4e4e8}'
    + '.reiwsh-signin{font-size:14px;font-weight:500;color:#6b7280;text-decoration:none}'
    + '.reiwsh-signin:hover{color:#1a2744}'
    + '.reiwsh-cta{background:#1a2744;color:#fff;border-radius:8px;padding:10px 22px;font-size:14px;font-weight:600;letter-spacing:.01em;text-decoration:none}'
    + '.reiwsh-cta:hover{background:#0f1a32}'
    + '@media(max-width:980px){.reiwsh-nav{padding:0 28px}}'
    + '@media(max-width:600px){.reiwsh-nav{padding:0 18px;height:60px}.reiwsh-link,.reiwsh-div{display:none}.reiwsh-right{gap:16px}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  var logoSVG = '<svg width="34" height="22" viewBox="0 0 56 36" fill="none"><polyline points="2,34 13,8 23,21 34,2 45,15 54,5" stroke="#1a2744" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><polyline points="34,2 45,15 54,5" stroke="#c4973b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="34" cy="2" r="4.5" fill="#c4973b"/></svg>';

  mount.innerHTML =
    '<nav class="reiwsh-nav">' +
      '<a href="/" class="reiwsh-brand">' + logoSVG + '<span class="reiwsh-word">REIW</span></a>' +
      '<div class="reiwsh-right">' +
        '<a href="/tools.html" class="reiwsh-link" data-page="tools">Tools</a>' +
        '<a href="/pricing.html" class="reiwsh-link" data-page="pricing">Pricing</a>' +
        '<a href="/dashboard.html" class="reiwsh-link" data-page="dashboard">Dashboard</a>' +
        '<span class="reiwsh-div"></span>' +
        '<a href="/login.html" class="reiwsh-signin" id="reiwsh-signin">Sign in</a>' +
        '<a href="/signup.html" class="reiwsh-cta" id="reiwsh-cta">Get started free</a>' +
      '</div>' +
    '</nav>';

  // Mark the current page (visible but disabled).
  if (cfg.page && cfg.page !== 'home') {
    var current = mount.querySelector('.reiwsh-link[data-page="' + cfg.page + '"]');
    if (current) {
      current.classList.add('reiwsh-active');
      current.removeAttribute('href');
      current.setAttribute('aria-current', 'page');
    }
  }

  // Session flip — one-time click wiring, behavior keyed off current mode.
  var signin = document.getElementById('reiwsh-signin');
  var cta = document.getElementById('reiwsh-cta');
  if (signin) {
    signin.addEventListener('click', function (e) {
      if (signin.dataset.mode !== 'out') return; // logged out: let the /login.html link work
      e.preventDefault();
      fetch(API + '/auth/logout', { method: 'POST', credentials: 'include' })
        .catch(function () {})
        .then(function () { window.location.reload(); });
    });
  }

  function applyAuthNav() {
    fetch(API + '/auth/me', { credentials: 'include', cache: 'no-store' })
      .then(function (r) {
        var loggedIn = r.ok;
        if (signin) {
          if (loggedIn) {
            signin.textContent = 'Log Out';
            signin.removeAttribute('href');
            signin.style.cursor = 'pointer';
            signin.dataset.mode = 'out';
          } else {
            signin.textContent = 'Sign in';
            signin.setAttribute('href', '/login.html');
            signin.style.cursor = '';
            signin.dataset.mode = 'in';
          }
        }
        if (cta) cta.style.display = loggedIn ? 'none' : '';
      })
      .catch(function () {});
  }

  applyAuthNav();
  window.addEventListener('pageshow', applyAuthNav);
})();
