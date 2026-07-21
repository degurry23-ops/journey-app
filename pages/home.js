/* Journey — Home Page (v2 — Travel Companion) */

safeRender(function() {
  var trips = loadTrips();
  var upcoming = trips.filter(function(t) { return t.status === 'planning'; });
  var active = trips.filter(function(t) { return t.status === 'traveling'; });
  var completed = trips.filter(function(t) { return t.status === 'completed'; });
  var next = upcoming[0];
  var activeTrip = active[0];

  // ── Hero: personalize when next trip exists ──
  if (next) {
    var today = new Date().toISOString().split('T')[0];
    var daysLeft = Math.max(0, daysBetween(today, next.startDate));
    var heroContent = document.getElementById('heroContent');
    if (heroContent) {
      heroContent.innerHTML =
        '<div class="section-badge"><span class="dot pulse"></span><span class="label">下一次旅行</span></div>' +
        '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:12px;">' +
          '<span style="font-size:56px;">' + (next.emoji || '🌏') + '</span>' +
          '<div>' +
            '<h1 style="font-family:var(--font-display);font-size:clamp(2rem,4vw,2.8rem);line-height:1.15;">' + (next.destination || '') + '<span class="gradient-text">之旅</span></h1>' +
            '<p style="font-size:15px;color:var(--muted-fg);margin-top:6px;">' + next.startDate + ' - ' + next.endDate + ' · ' + (next.days instanceof Array ? next.days.length : (next.days || '?')) + '天 · 👥 ' + (next.members || 1) + '人</p>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:20px;display:flex;gap:16px;align-items:center;flex-wrap:wrap;">' +
          '<div style="display:flex;align-items:baseline;gap:4px;">' +
            '<span style="font-family:var(--font-display);font-size:3rem;line-height:1;">' + daysLeft + '</span>' +
            '<span style="font-size:16px;color:var(--muted-fg);">天后出发</span>' +
          '</div>' +
          '<div style="flex:1;max-width:300px;">' +
            '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted-fg);margin-bottom:4px;"><span>准备进度</span><span>' + (next.readiness || 30) + '%</span></div>' +
            '<div style="height:6px;background:var(--muted);border-radius:3px;"><div style="width:' + (next.readiness || 30) + '%;height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));border-radius:3px;"></div></div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:24px;display:flex;gap:8px;flex-wrap:wrap;">' +
          '<a href="trip-detail.html?id=' + next.id + '" class="btn btn-primary btn-lg">继续完善旅程 <i class="fas fa-arrow-right"></i></a>' +
          '<a href="create.html" class="btn btn-outline btn-lg">规划新旅行</a>' +
        '</div>';
    }
  }

  // ── Active Journey card ──
  var activeSection = document.getElementById('activeSection');
  if (activeTrip && activeSection) {
    activeSection.style.display = 'block';
    var card = document.getElementById('activeTripCard');
    var nameEl = document.getElementById('activeTripName');
    var metaEl = document.getElementById('activeTripMeta');
    var emojiEl = document.getElementById('activeEmoji');
    var tlLink = document.getElementById('activeTimelineLink');
    var mapLink = document.getElementById('activeMapLink');
    var expLink = document.getElementById('activeExpenseLink');

    if (nameEl) nameEl.textContent = activeTrip.name;
    if (metaEl) metaEl.textContent = 'Day ' + (activeTrip.days instanceof Array ? activeTrip.days.length : 1) + ' · ' + (activeTrip.startDate || '') + ' 至今';
    if (emojiEl) emojiEl.textContent = activeTrip.emoji || '✈️';
    if (tlLink) tlLink.href = 'today.html?trip=' + activeTrip.id;
    if (mapLink) mapLink.href = 'map.html?trip=' + activeTrip.id;
    if (expLink) expLink.href = 'expenses.html?trip=' + activeTrip.id;

    if (card) {
      card.onclick = function() { location.href = 'trip-detail.html?id=' + activeTrip.id; };
    }
  }

  // ── Stats ──
  ['statTotal','statActive','statCompleted','statUpcoming'].forEach(function(id) {
    var el = document.getElementById(id);
    if (!el) return;
    if (id === 'statTotal') el.textContent = trips.length;
    if (id === 'statActive') el.textContent = active.length;
    if (id === 'statCompleted') el.textContent = completed.length;
    if (id === 'statUpcoming') el.textContent = upcoming.length;
  });

  // ── Travel Memories ──
  var memoriesGrid = document.getElementById('memoriesGrid');
  if (memoriesGrid) {
    var destColors = { '日本东京': '#E53E3E', '四川成都': '#DD6B20', '上海': '#3182CE', '云南大理': '#38A169' };
    var destBgs = { '日本东京': 'linear-gradient(135deg,#FFE0E0,#FFD0D0)', '四川成都': 'linear-gradient(135deg,#FFE8CC,#FFD8B8)', '上海': 'linear-gradient(135deg,#DBEAFE,#C8DCF8)', '云南大理': 'linear-gradient(135deg,#D1FAE5,#BCF0D4)' };

    if (completed.length) {
      memoriesGrid.innerHTML = completed.map(function(t) {
        var bg = destBgs[t.destination] || 'linear-gradient(135deg,var(--muted),var(--border))';
        var color = destColors[t.destination] || 'var(--accent)';
        return '<a href="journal.html?trip=' + t.id + '" class="memory-card" style="background:' + bg + ';border-radius:var(--radius-lg);padding:0;overflow:hidden;text-decoration:none;color:inherit;display:block;transition:all .2s;cursor:pointer;">' +
          '<div style="padding:28px 24px 20px;">' +
            '<div style="font-size:40px;margin-bottom:12px;">' + (t.emoji || '📖') + '</div>' +
            '<div style="font-weight:700;font-size:18px;margin-bottom:4px;">' + t.name + '</div>' +
            '<div style="font-size:13px;color:var(--muted-fg);">' + t.startDate + ' - ' + t.endDate + '</div>' +
            '<div style="font-size:13px;color:var(--muted-fg);margin-top:2px;">' + (t.days instanceof Array ? t.days.length : t.days) + '天 · ' + (t.members || 1) + '人同行</div>' +
            '<div style="margin-top:16px;display:flex;gap:4px;flex-wrap:wrap;">' + (t.tags || t.highlights || ['旅行']).slice(0,3).map(function(tg) {
              return '<span style="font-size:11px;background:rgba(255,255,255,.7);padding:2px 10px;border-radius:999px;color:' + color + ';">' + tg + '</span>';
            }).join('') + '</div>' +
          '</div>' +
          '<div style="height:4px;background:' + color + ';width:100%;"></div>' +
        '</a>';
      }).join('');
      // Show "explore" card
      memoriesGrid.innerHTML += '<a href="create.html" class="memory-card" style="background:var(--muted);border-radius:var(--radius-lg);padding:28px 24px;text-decoration:none;color:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:200px;border:2px dashed var(--border);transition:all .2s;cursor:pointer;">' +
        '<i class="fas fa-plus" style="font-size:28px;color:var(--muted-fg);margin-bottom:12px;"></i>' +
        '<span style="font-weight:600;font-size:15px;color:var(--muted-fg);">开始新的旅程</span>' +
        '<span style="font-size:12px;color:var(--muted-fg);margin-top:4px;">AI 帮你规划</span></a>';
    } else {
      memoriesGrid.innerHTML = '<a href="create.html" class="memory-card" style="background:linear-gradient(135deg,rgba(0,82,255,.04),rgba(77,124,255,.04));border-radius:var(--radius-lg);padding:40px 24px;text-decoration:none;color:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:180px;border:2px dashed rgba(0,82,255,.2);transition:all .2s;cursor:pointer;grid-column:1/-1;">' +
        '<span style="font-size:48px;margin-bottom:12px;">🌅</span>' +
        '<span style="font-weight:700;font-size:18px;margin-bottom:4px;">你的下一段故事还没有开始</span>' +
        '<span style="font-size:14px;color:var(--muted-fg);margin-bottom:16px;">让 AI 帮你规划第一次旅行</span>' +
        '<span class="btn btn-primary btn-sm">开始探索</span></a>';
    }
  }
});
