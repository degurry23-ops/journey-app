/* Journey — Home Page (v3 — AI Travel Companion) */

safeRender(function() {
  var trips = loadTrips();
  var upcoming = trips.filter(function(t) { return t.status === 'planning'; });
  var active = trips.filter(function(t) { return t.status === 'traveling'; });
  var completed = trips.filter(function(t) { return t.status === 'completed'; });
  var next = upcoming[0];
  var activeTrip = active[0];

  // ── Hero: AI value-driven ──
  if (next) {
    var today = new Date().toISOString().split('T')[0];
    var daysLeft = Math.max(0, daysBetween(today, next.startDate));
    var dayCount = next.days instanceof Array ? next.days.length : 0;
    var placeCount = next.days instanceof Array ? next.days.reduce(function(s, d) { return s + (d.places ? d.places.length : 0); }, 0) : 0;
    var heroContent = document.getElementById('heroContent');
    if (heroContent) {
      heroContent.innerHTML =
        '<div class="section-badge"><span class="dot pulse"></span><span class="label">✨ AI 正在陪你准备下一段旅程</span></div>' +
        '<div style="display:flex;align-items:center;gap:20px;flex-wrap:wrap;margin-top:16px;">' +
          '<span style="font-size:56px;">' + (next.emoji || '🌏') + '</span>' +
          '<div>' +
            '<h1 style="font-family:var(--font-display);font-size:clamp(2rem,4vw,2.8rem);line-height:1.15;">' + (next.destination || '') + '<span class="gradient-text"> · ' + dayCount + '日探索</span></h1>' +
            '<p style="font-size:15px;color:var(--muted-fg);margin-top:6px;">' + next.startDate + ' 出发 · ' + daysLeft + '天后 · 👥 ' + (next.members || 1) + '人同行</p>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px;">' +
          '<div style="background:rgba(0,82,255,.06);border-radius:var(--radius);padding:14px 16px;">' +
            '<div style="font-size:12px;color:var(--muted-fg);margin-bottom:2px;">📍 推荐地点</div>' +
            '<div style="font-weight:700;font-size:1.2rem;">' + placeCount + ' <span style="font-size:12px;color:var(--muted-fg);font-weight:400;">个</span></div>' +
          '</div>' +
          '<div style="background:rgba(16,185,129,.06);border-radius:var(--radius);padding:14px 16px;">' +
            '<div style="font-size:12px;color:var(--muted-fg);margin-bottom:2px;">🗓 每日路线</div>' +
            '<div style="font-weight:700;font-size:1.2rem;">' + dayCount + ' <span style="font-size:12px;color:var(--muted-fg);font-weight:400;">天已规划</span></div>' +
          '</div>' +
          '<div style="background:rgba(245,158,11,.06);border-radius:var(--radius);padding:14px 16px;">' +
            '<div style="font-size:12px;color:var(--muted-fg);margin-bottom:2px;">💰 预算估算</div>' +
            '<div style="font-weight:700;font-size:1.2rem;">¥' + ((next.budget || 5000) * (next.members || 1) / 1000).toFixed(1) + 'k</div>' +
          '</div>' +
          '<div style="background:rgba(139,92,246,.06);border-radius:var(--radius);padding:14px 16px;">' +
            '<div style="font-size:12px;color:var(--muted-fg);margin-bottom:2px;">🎒 行李清单</div>' +
            '<div style="font-weight:700;font-size:1.2rem;">已生成</div>' +
          '</div>' +
        '</div>' +
        '<div style="margin-top:24px;display:flex;gap:8px;flex-wrap:wrap;">' +
          '<a href="trip-detail.html?id=' + next.id + '" class="btn btn-primary btn-lg">查看完整旅行计划 <i class="fas fa-arrow-right"></i></a>' +
          '<a href="create.html" class="btn btn-outline btn-lg">规划新旅行</a>' +
        '</div>';
    }
  }

  // ── Active Journey card (enhanced with today's route) ──
  var activeSection = document.getElementById('activeSection');
  if (activeTrip && activeSection) {
    activeSection.style.display = 'block';
    var nameEl = document.getElementById('activeTripName');
    var metaEl = document.getElementById('activeTripMeta');
    var emojiEl = document.getElementById('activeEmoji');
    var tlLink = document.getElementById('activeTimelineLink');
    var mapLink = document.getElementById('activeMapLink');
    var expLink = document.getElementById('activeExpenseLink');

    if (nameEl) nameEl.textContent = activeTrip.name;
    var todayDay = activeTrip.days instanceof Array ? activeTrip.days[0] : null;
    var todayPlaces = todayDay && todayDay.places ? todayDay.places.slice(0, 3).map(function(p) { return p.name; }).join(' → ') : '自由探索';
    if (metaEl) metaEl.innerHTML = '<span style="opacity:.7;">📍 今日路线：</span>' + todayPlaces + '<br><span style="font-size:11px;opacity:.5;">' + (todayDay ? todayDay.weather || '☀️' : '') + ' · ' + (activeTrip.startDate || '') + ' 至今</span>';
    if (emojiEl) emojiEl.textContent = activeTrip.emoji || '✈️';
    if (tlLink) tlLink.href = 'today.html?trip=' + activeTrip.id;
    if (mapLink) mapLink.href = 'map.html?trip=' + activeTrip.id;
    if (expLink) expLink.href = 'expenses.html?trip=' + activeTrip.id;

    var card = document.getElementById('activeTripCard');
    if (card) {
      card.onclick = function() { location.href = 'today.html?trip=' + activeTrip.id; };
    }
  }

  // ── Travel Footprint Stats ──
  var totalCities = new Set(trips.map(function(t) { return t.destination; })).size;
  var totalPlaces = trips.reduce(function(s, t) {
    return s + (t.days instanceof Array ? t.days.reduce(function(ds, d) { return ds + (d.places ? d.places.length : 0); }, 0) : 0);
  }, 0);
  var totalPhotos = trips.reduce(function(s, t) {
    var photos = loadPhotos(t.id);
    return s + (photos ? photos.length : 0);
  }, 0);
  var totalMemories = completed.length;

  var statMap = { statCities: totalCities, statPlaces: totalPlaces, statPhotos: totalPhotos, statMemories: totalMemories };
  Object.keys(statMap).forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.textContent = statMap[id];
  });

  // ── Travel Memories (with AI summary) ──
  var memoriesGrid = document.getElementById('memoriesGrid');
  if (memoriesGrid) {
    var destColors = { '日本东京': '#E53E3E', '四川成都': '#DD6B20', '上海': '#3182CE', '云南大理': '#38A169' };
    var destBgs = { '日本东京': 'linear-gradient(135deg,#FFF0F0,#FFE0E0)', '四川成都': 'linear-gradient(135deg,#FFF5EB,#FFE8CC)', '上海': 'linear-gradient(135deg,#EBF4FF,#DBEAFE)', '云南大理': 'linear-gradient(135deg,#ECFDF5,#D1FAE5)' };

    if (completed.length) {
      memoriesGrid.innerHTML = completed.map(function(t) {
        var bg = destBgs[t.destination] || 'linear-gradient(135deg,#F8FAFC,#F1F5F9)';
        var color = destColors[t.destination] || 'var(--accent)';
        var summary = t.summary ? (t.summary.length > 50 ? t.summary.slice(0, 50) + '...' : t.summary) : '';
        var placeCount = t.days instanceof Array ? t.days.reduce(function(s, d) { return s + (d.places ? d.places.length : 0); }, 0) : 0;
        return '<a href="journal.html?trip=' + t.id + '" class="memory-card" style="background:' + bg + ';border-radius:var(--radius-lg);padding:0;overflow:hidden;text-decoration:none;color:inherit;display:block;transition:all .25s;cursor:pointer;">' +
          '<div style="padding:24px 20px 16px;">' +
            '<div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">' +
              '<span style="font-size:36px;">' + (t.emoji || '📖') + '</span>' +
              '<div>' +
                '<div style="font-weight:700;font-size:16px;">' + t.name + '</div>' +
                '<div style="font-size:12px;color:var(--muted-fg);">' + (t.startDate || '').slice(0, 7) + ' · ' + placeCount + '个足迹</div>' +
              '</div>' +
            '</div>' +
            (summary ? '<p style="font-size:12px;color:var(--muted-fg);line-height:1.5;margin-bottom:12px;font-style:italic;">"' + summary + '"</p>' : '') +
            '<div style="display:flex;gap:4px;flex-wrap:wrap;">' + (t.tags || t.highlights || ['旅行']).slice(0, 3).map(function(tg) {
              return '<span style="font-size:11px;background:rgba(255,255,255,.6);padding:2px 10px;border-radius:999px;color:' + color + ';">' + tg + '</span>';
            }).join('') + '</div>' +
          '</div>' +
          '<div style="height:3px;background:' + color + ';width:100%;opacity:.5;"></div>' +
        '</a>';
      }).join('');
      // "Start new" card
      memoriesGrid.innerHTML += '<a href="create.html" class="memory-card" style="background:var(--muted);border-radius:var(--radius-lg);padding:24px 20px;text-decoration:none;color:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:180px;border:2px dashed var(--border);transition:all .2s;cursor:pointer;">' +
        '<i class="fas fa-plus" style="font-size:24px;color:var(--muted-fg);margin-bottom:8px;"></i>' +
        '<span style="font-weight:600;font-size:14px;">开始新的旅程</span>' +
        '<span style="font-size:11px;color:var(--muted-fg);margin-top:2px;">AI 帮你规划</span></a>';
    } else {
      memoriesGrid.innerHTML = '<a href="create.html" class="memory-card" style="background:linear-gradient(135deg,rgba(0,82,255,.03),rgba(77,124,255,.03));border-radius:var(--radius-lg);padding:40px 24px;text-decoration:none;color:inherit;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:180px;border:2px dashed rgba(0,82,255,.15);transition:all .2s;cursor:pointer;grid-column:1/-1;">' +
        '<span style="font-size:48px;margin-bottom:12px;">🌅</span>' +
        '<span style="font-weight:700;font-size:18px;margin-bottom:4px;">你的下一段故事还没有开始</span>' +
        '<span style="font-size:14px;color:var(--muted-fg);margin-bottom:16px;">让 AI 帮你规划第一次旅行</span>' +
        '<span class="btn btn-primary btn-sm">开始探索</span></a>';
    }
  }
});
