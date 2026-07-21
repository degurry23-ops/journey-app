/* ═══════════════════════════════════════════════════
   Journey — Shared Header Component
   Usage: renderHeader(currentPage) where currentPage
   is one of 'home','journeys','create','settings'
   ═══════════════════════════════════════════════════ */

function renderHeader(currentPage) {
  const pages = [
    { key: 'home', label: '首页', href: 'index.html', icon: 'fa-home' },
    { key: 'journeys', label: '我的旅行', href: 'journeys.html', icon: 'fa-suitcase' },
    { key: 'create', label: '✨ AI 规划', href: 'create.html', icon: 'fa-magic' },
  ];

  // User auth state
  var profile = {};
  var token = localStorage.getItem('journey_token');
  try { profile = JSON.parse(localStorage.getItem('journey_user')) || {}; } catch(e) {}
  var isLoggedIn = !!(token && profile.username);
  var userHTML = isLoggedIn
    ? '<div style="display:flex;align-items:center;gap:12px;"><a href="settings.html" style="display:flex;align-items:center;gap:6px;text-decoration:none;color:var(--fg);font-size:13px;font-weight:500;"><span style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent2));display:flex;align-items:center;justify-content:center;color:#fff;font-size:12px;">' + (profile.username || '?')[0] + '</span>' + (profile.username || '') + '</a><a href="#" onclick="doLogout()" style="color:var(--muted-fg);font-size:12px;text-decoration:none;">退出</a></div>'
    : '<a href="login.html" style="text-decoration:none;color:var(--muted-fg);font-size:13px;font-weight:500;">👤 登录</a>';

  const navLinks = pages.map(p =>
    `<a href="${p.href}"${p.key === currentPage ? ' class="active"' : ''}>${p.label}</a>`
  ).join('') + userHTML;

  const mobileLinks = pages.map(p =>
    `<a href="${p.href}"${p.key === currentPage ? ' class="active"' : ''}><i class="fas ${p.icon}"></i>${p.label}</a>`
  ).join('');

  const html = `
  <header>
    <div class="container header-inner">
      <a href="index.html" class="logo">
        <div class="logo-icon"><i class="fas fa-map-marker-alt"></i></div>
        Journey
      </a>
      <nav>${navLinks}</nav>
    </div>
  </header>
  <nav class="mobile-nav mobile-only">${mobileLinks}</nav>`;

  // Logout function
  window.doLogout = function() {
    localStorage.removeItem('journey_token');
    localStorage.removeItem('journey_user');
    location.href = 'index.html';
  };

  // Insert at top of body
  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  } else {
    document.body.insertAdjacentHTML('afterbegin', html);
  }
}
