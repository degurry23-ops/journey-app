/* Journey — Trip List (V3 — Travel Console) */

safeRender(function() {
  var trips = loadTrips();
  var today = new Date().toISOString().split('T')[0];

  // ── Sort: active first, planning by date asc, completed by date desc ──
  trips.sort(function(a, b) {
    var order = { traveling: 0, planning: 1, completed: 2 };
    var oa = order[a.status] !== undefined ? order[a.status] : 3;
    var ob = order[b.status] !== undefined ? order[b.status] : 3;
    if (oa !== ob) return oa - ob;
    if (a.status === 'traveling') return 0;
    if (a.status === 'planning') return (a.startDate || '').localeCompare(b.startDate || '');
    return (b.endDate || '').localeCompare(a.endDate || '');
  });

  var counts = { all: trips.length };
  ['planning','traveling','completed'].forEach(function(s) {
    counts[s] = trips.filter(function(t) { return t.status === s; }).length;
  });

  var tabKeys = ['all','planning','traveling','completed'];
  var tabLabels = ['全部','计划中','进行中','已完成'];

  // ── Destination theming ──
  var destThemes = {
    '日本东京': { color: '#DC2626', bg: 'linear-gradient(135deg,#FEF2F2,#FEE2E2)', emoji: '🇯🇵' },
    '四川成都': { color: '#EA580C', bg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', emoji: '🐼' },
    '上海':     { color: '#2563EB', bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', emoji: '🌆' },
    '云南大理': { color: '#16A34A', bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', emoji: '🏔️' },
    '北京':     { color: '#9333EA', bg: 'linear-gradient(135deg,#FAF5FF,#EDE9FE)', emoji: '🏯' },
    '重庆':     { color: '#DC2626', bg: 'linear-gradient(135deg,#FFF5F5,#FEE2E2)', emoji: '🌶' },
    '韩国首尔': { color: '#DB2777', bg: 'linear-gradient(135deg,#FDF2F8,#FCE7F3)', emoji: '🇰🇷' },
    '泰国曼谷': { color: '#0891B2', bg: 'linear-gradient(135deg,#ECFEFF,#CFFAFE)', emoji: '🇹🇭' }
  };

  function getTheme(dest, emoji) {
    for (var k in destThemes) {
      if (dest && dest.indexOf(k.replace(/^(日本|韩国|泰国|四川|云南)/,'')) >= 0) return destThemes[k];
    }
    return { color: 'var(--accent)', bg: 'linear-gradient(135deg,var(--muted),var(--border))', emoji: emoji || '🌏' };
  }

  // ── Safe HTML ──
  function esc(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  // ── Update tabs ──
  document.querySelectorAll('.tab').forEach(function(t, i) {
    var key = tabKeys[i];
    if (counts[key] > 0) {
      t.textContent = tabLabels[i] + ' (' + counts[key] + ')';
    } else {
      t.textContent = tabLabels[i];
      t.style.opacity = '0.5';
    }
  });

  // ── Render ──
  function render(list, status) {
    var c = document.getElementById('tripList');
    var emptyMsg = document.getElementById('emptyFilterMsg');
    if (emptyMsg) emptyMsg.style.display = 'none';
    // Reset tab opacities
    document.querySelectorAll('.tab').forEach(function(t) { t.style.opacity = (counts[tabKeys[Array.from(t.parentElement.children).indexOf(t)]] > 0) ? '1' : '0.5'; });

    if (!trips.length) {
      c.innerHTML =
        '<div class="empty-state" style="grid-column:1/-1;">' +
          '<span style="font-size:56px;display:block;margin-bottom:16px;">🌅</span>' +
          '<h3>你的旅程尚未开始</h3>' +
          '<p style="margin-bottom:20px;">让 AI 帮你规划第一次旅行</p>' +
          '<a href="create.html" class="btn btn-primary btn-lg">✨ 开始AI规划</a>' +
        '</div>';
      return;
    }

    if (!list.length) {
      c.innerHTML = '';
      if (emptyMsg) {
        emptyMsg.style.display = 'block';
        emptyMsg.innerHTML = '<p>' + tabLabels[tabKeys.indexOf(status)] + '的旅程为空</p><button class="btn btn-outline btn-sm" onclick="filterTrips(\'all\', document.querySelector(\'.tab\'))" style="margin-top:8px;">查看全部旅程</button>';
      }
      return;
    }

    c.innerHTML = list.map(function(t) {
      var theme = getTheme(t.destination, t.emoji);
      var dayCount = t.days instanceof Array ? t.days.length : 0;
      var placeCount = t.days instanceof Array ? t.days.reduce(function(s, d) { return s + (d.places ? d.places.length : 0); }, 0) : 0;
      var totalExp = (t.expenses || []).reduce(function(s, e) { return s + (Number(e.amount) || 0); }, 0);
      var photos = loadPhotos(t.id) || [];
      var placeNames = t.days instanceof Array ? t.days.slice(0,3).reduce(function(arr, d) { return arr.concat((d.places||[]).map(function(p){return p.name;})); }, []) : [];
      var extraPlaces = Math.max(0, placeCount - 3);
      var readiness = (t.readiness != null) ? t.readiness : 0;

      // ── Status-specific content ──
      var actionHTML = '';
      if (t.status === 'traveling') {
        // Progress: Day X/Y
        var daysGone = daysBetween(t.startDate, today);
        var currentDay = Math.min(dayCount, Math.max(1, daysGone + 1));
        var pct = dayCount > 0 ? Math.round(currentDay / dayCount * 100) : 0;
        actionHTML = '<div class="card-action">' +
          '<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted-fg);">' +
            '<span>Day ' + currentDay + '/' + (dayCount || '?') + '</span>' +
            '<div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;"><div style="width:' + pct + '%;height:100%;background:var(--success);border-radius:2px;"></div></div>' +
            '<span>' + pct + '%</span>' +
          '</div>' +
          (placeCount ? '<div style="font-size:12px;color:var(--muted-fg);margin-top:6px;">今日 ' + (placeCount/dayCount).toFixed(0) + ' 个地点' + (totalExp > 0 ? ' · 已消费 ¥' + totalExp.toLocaleString() : '') + '</div>' : '') +
        '</div>';
      } else if (t.status === 'planning') {
        // Readiness bar
        var missing = [];
        if (dayCount < 2) missing.push('行程');
        if ((t.members||1) < 2) missing.push('同行人');
        if (!t.budget) missing.push('预算');
        actionHTML = '<div class="card-action">' +
          '<div style="display:flex;align-items:center;gap:8px;font-size:12px;color:var(--muted-fg);margin-bottom:4px;">' +
            '<span>准备度 ' + readiness + '%</span>' +
            '<div style="flex:1;height:4px;background:var(--border);border-radius:2px;overflow:hidden;"><div style="width:' + readiness + '%;height:100%;background:linear-gradient(90deg,var(--warning),var(--accent));border-radius:2px;"></div></div>' +
          '</div>' +
          (missing.length ? '<div style="font-size:11px;color:var(--warning);">还差：' + missing.join('、') + '</div>' : '') +
          (t.startDate ? '<div style="font-size:11px;color:var(--muted-fg);margin-top:2px;">' + (Math.max(0, daysBetween(today, t.startDate))) + '天后出发</div>' : '') +
        '</div>';
      } else {
        // Completed stats
        var daysRecorded = dayCount || 0;
        actionHTML = '<div class="card-action">' +
          '<div style="display:flex;gap:16px;font-size:12px;color:var(--muted-fg);">' +
            (daysRecorded ? '<span>📆 ' + daysRecorded + '天行程</span>' : '') +
            (photos.length ? '<span>📷 ' + photos.length + '张照片</span>' : '') +
            (totalExp > 0 ? '<span>💰 ¥' + totalExp.toLocaleString() + '</span>' : '') +
          '</div>' +
          (t.summary ? '<div style="font-size:12px;color:var(--muted-fg);margin-top:4px;font-style:italic;">' + esc(t.summary.slice(0, 50)) + (t.summary.length > 50 ? '...' : '') + '</div>' : '') +
        '</div>';
      }

      return '<a href="trip-detail.html?id=' + t.id + '" class="journey-card" style="border-left:4px solid ' + theme.color + ';">' +
        '<div style="display:flex;align-items:center;gap:12px;margin-bottom:10px;">' +
          '<span style="font-size:32px;">' + esc(t.emoji || theme.emoji || '🌏') + '</span>' +
          '<div style="flex:1;min-width:0;">' +
            '<div style="font-weight:700;font-size:16px;">' + esc(t.name) + '</div>' +
            '<div style="font-size:13px;color:var(--muted-fg);">' + esc(t.startDate) + ' - ' + esc(t.endDate) + ' · ' + (dayCount || '?') + '天 · ' + (t.members||1) + '人</div>' +
          '</div>' +
          '<span class="tag tag-sm ' + (t.status==='planning'?'tag-amber':t.status==='traveling'?'tag-green':'tag-gray') + '">' + (t.status==='planning'?'计划中':t.status==='traveling'?'进行中':'已完成') + '</span>' +
        '</div>' +
        (placeNames.length ? '<div style="display:flex;gap:4px;flex-wrap:wrap;margin-bottom:8px;">' +
          placeNames.slice(0,3).map(function(n) { return '<span class="place-chip">' + esc(n) + '</span>'; }).join('') +
          (extraPlaces > 0 ? '<span class="place-chip" style="background:var(--muted);">+' + extraPlaces + '</span>' : '') +
        '</div>' : (dayCount === 0 ? '<div style="font-size:12px;color:var(--muted-fg);margin-bottom:8px;">行程待完善</div>' : '')) +
        actionHTML +
      '</a>';
    }).join('');
  }

  window.filterTrips = function(status, el) {
    document.querySelectorAll('.tab').forEach(function(t) { t.classList.remove('active'); });
    el.classList.add('active');
    var filtered = status === 'all' ? trips : trips.filter(function(t) { return t.status === status; });
    render(filtered, status);
  };

  render(trips, 'all');
});
