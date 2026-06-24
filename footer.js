/* REIW footer — footer.js v1.1
   Static footer markup (with hardcoded legal links for crawler/Meta visibility)
   lives in each page's HTML. This component owns the styling and fills the
   copyright entity + year, so the entity name changes in ONE place.
   v1.1: sticky footer — pins to the viewport bottom on short pages, pushed down by content.
   Usage (place right after the <footer> markup):
     <footer class="reiwf-footer">
       <a href="/" class="reiwf-brand">[logo]<span class="reiwf-word">REIW</span></a>
       <nav class="reiwf-links">
         <a href="/privacy.html">Privacy Policy</a>
         <a href="/terms.html">Terms &amp; Conditions</a>
       </nav>
       <span class="reiwf-copy">&copy; <span id="reiw-year"></span> <span id="reiw-entity"></span></span>
     </footer>
     <script src="/footer.js"></script> */
(function () {
  // Single override point = window.REIW_ENTITY (shared with header.js About dialog).
  var ENTITY = window.REIW_ENTITY || 'VectorSprint LLC'; // <-- change the copyright holder here

  var css = ''
    + 'html{height:100%}'
    + 'body{min-height:100vh;display:flex;flex-direction:column}'
    + '.reiwf-footer{margin-top:auto;background:#1a2744;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;padding:22px 40px}'
    + '.reiwf-brand{display:flex;align-items:center;gap:9px;text-decoration:none}'
    + '.reiwf-word{font-family:\'Playfair Display\',Georgia,serif;font-size:18px;font-weight:900;color:#fff}'
    + '.reiwf-links{display:flex;gap:20px;align-items:center;flex-wrap:wrap}'
    + '.reiwf-links a{color:rgba(255,255,255,0.62);text-decoration:none;font-size:13px;font-weight:500}'
    + '.reiwf-links a:hover{color:#fff}'
    + '.reiwf-copy{color:rgba(255,255,255,0.45);font-size:12px}'
    + '@media(max-width:640px){.reiwf-footer{flex-direction:column;text-align:center;padding:22px 20px}}';
  var st = document.createElement('style');
  st.textContent = css;
  document.head.appendChild(st);

  function fill() {
    var y = document.getElementById('reiw-year');
    if (y) y.textContent = new Date().getFullYear();
    var e = document.getElementById('reiw-entity');
    if (e) e.textContent = ENTITY;
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fill);
  } else {
    fill();
  }
})();
