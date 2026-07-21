/* Journey — Today Page (Active Trip Dashboard) */

safeRender(function() {
  var trip = getTripById(getParam('trip'));
  if (!trip) {
    // Try to find active trip
    var trips = loadTrips();
    var active = trips.filter(function(t) { return t.status === 'traveling'; });
    if (active.length) trip = active[0];
    else { showPageError('fa-calendar-check', '没有进行中的旅行', '开始一段旅行后这里会显示今日概览', 'index.html', '返回首页'); return; }
  }

  if (!(trip.days instanceof Array)) trip.days = [];

  // Determine which day is "today" based on trip dates
  var todayStr = new Date().toISOString().split('T')[0];
  var todayDayIdx = trip.days.findIndex(function(d) { return d.date === todayStr; });
  // Fallback: calculate day index from start date
  if (todayDayIdx < 0) {
    var daysSinceStart = daysBetween(trip.startDate, todayStr);
    todayDayIdx = Math.min(trip.days.length - 1, Math.max(0, daysSinceStart));
  }
  var day = trip.days[todayDayIdx];
  if (!day) day = trip.days[0];
  if (!day) { showPageError('fa-calendar', '暂无日程', '请先在行程详情中添加日程', 'trip-detail.html?id=' + trip.id, '前往行程详情'); return; }

  // ── Greeting ──
  var hour = new Date().getHours();
  if (typeof track === 'function') track('today_opened');
  var greeting = hour < 11 ? '☀️ 早上好' : hour < 14 ? '🌤 中午好' : hour < 18 ? '🌅 下午好' : '🌙 晚上好';
  var el = document.getElementById('todayGreeting');
  if (el) el.textContent = greeting;

  el = document.getElementById('todayTripName');
  if (el) el.textContent = trip.name || (trip.destination + '之旅');

  el = document.getElementById('todayMeta');
  if (el) el.textContent = 'Day ' + (todayDayIdx + 1) + ' · ' + (day.date || today) + ' · ' + trip.destination;

  // ── Weather ──
  el = document.getElementById('todayWeather');
  if (el) {
    var weather = day.weather || '☀️ 晴 25°C';
    var weatherEmoji = weather.indexOf('雨') >= 0 ? '🌧' : weather.indexOf('多云') >= 0 ? '⛅' : weather.indexOf('阴') >= 0 ? '☁️' : '☀️';
    el.innerHTML = weatherEmoji + ' <span>' + weather + '</span>';
  }

  // ── Quick links ──
  var links = [
    { id: 'todayMapLink', href: 'map.html?trip=' + trip.id },
    { id: 'todayExpenseLink', href: 'expenses.html?trip=' + trip.id },
    { id: 'todayJournalLink', href: 'journal.html?trip=' + trip.id }
  ];
  links.forEach(function(l) {
    var a = document.getElementById(l.id);
    if (a) a.href = l.href;
  });

  // ── AI Tip ──
  el = document.getElementById('aiTipText');
  if (el) {
    var tips = [
      day.tip || '今天天气不错，适合出行~',
      '记得每隔2小时补充水分 💧',
      '拍张照片，记录此刻的美好 📸',
      '下午可能有变化，随时查看天气更新',
      '走路太久记得休息一下，旅行不是赶路 🚶'
    ];
    el.textContent = tips[(todayDayIdx || 0) % tips.length];
  }

  // ── Today's Route (with next-stop highlight) ──
  el = document.getElementById('todayRoute');
  if (el && day.places && day.places.length) {
    var catIcon = { '景点': '🏯', '美食': '🍜', '咖啡': '☕', '购物': '🛍', '住宿': '🏨', '交通': '🚇', '其他': '📍' };
    // Find next upcoming place (first one not yet passed based on time)
    var nowHour = new Date().getHours();
    var nextIdx = 0;
    day.places.forEach(function(p, i) {
      var pHour = parseInt((p.time || '09:00').split(':')[0]) || 9;
      if (pHour <= nowHour + 1) nextIdx = i;
    });
    nextIdx = Math.min(nextIdx + 1, day.places.length - 1);
    var nextPlace = day.places[nextIdx];

    // Next stop highlight card
    if (nextPlace) {
      el.innerHTML = '<a href="' + (nextPlace.lat ? 'https://uri.amap.com/marker?position=' + nextPlace.lng + ',' + nextPlace.lat + '&name=' + encodeURIComponent(nextPlace.name) : '#') + '" target="_blank" style="text-decoration:none;color:inherit;">' +
        '<div class="card" style="margin-bottom:16px;border:2px solid var(--accent);background:linear-gradient(135deg,rgba(0,82,255,.03),rgba(77,124,255,.03));">' +
          '<div style="font-size:11px;color:var(--accent);font-weight:600;margin-bottom:6px;">📍 下一站</div>' +
          '<div style="display:flex;align-items:center;gap:12px;">' +
            '<span style="font-size:28px;">' + (catIcon[nextPlace.cat] || '📍') + '</span>' +
            '<div style="flex:1;">' +
              '<div style="font-weight:700;font-size:16px;">' + nextPlace.name + '</div>' +
              '<div style="font-size:13px;color:var(--muted-fg);">' + (nextPlace.time || '') + ' · ' + (nextPlace.duration || '1h') + ' · ' + (nextPlace.fee || '免费') + '</div>' +
            '</div>' +
            '<i class="fas fa-arrow-right" style="color:var(--accent);"></i>' +
          '</div></div></a>';
    }

    // Full route list
    el.innerHTML += day.places.map(function(p, i) {
      var isNext = (i === nextIdx);
      return '<div style="position:relative;margin-bottom:12px;' + (isNext ? 'background:rgba(0,82,255,.03);border-radius:var(--radius);padding:8px;margin-left:-8px;margin-right:-8px;' : '') + '">' +
        '<div class="route-dot' + (i <= nextIdx ? ' done' : '') + '" style="' + (isNext ? 'background:var(--accent);box-shadow:0 0 0 2px var(--accent);' : '') + '"></div>' +
        '<div style="margin-left:8px;">' +
          '<div style="display:flex;align-items:center;gap:8px;">' +
            '<span style="font-family:var(--font-mono);font-size:12px;color:var(--muted-fg);min-width:44px;">' + (p.time || '09:00') + '</span>' +
            '<span>' + (catIcon[p.cat] || '📍') + '</span>' +
            '<span style="font-weight:' + (isNext ? '700' : '500') + ';font-size:14px;">' + p.name + '</span>' +
            (isNext ? '<span class="tag tag-blue" style="font-size:10px;">下一站</span>' : '') +
          '</div>' +
          '<div style="margin-left:64px;font-size:12px;color:var(--muted-fg);margin-top:2px;">' +
            (p.duration || '1h') + ' · ' + (p.fee || '免费') +
            (p.lat ? ' · <a href="https://uri.amap.com/marker?position=' + p.lng + ',' + p.lat + '&name=' + encodeURIComponent(p.name) + '" target="_blank" style="color:var(--accent);text-decoration:none;">📍导航</a>' : '') +
          '</div>' +
        '</div></div>';
    }).join('');
  } else if (el) {
    el.innerHTML = '<div class="empty-state" style="padding:20px;"><i class="fas fa-map-pin"></i><h3>今日暂无安排</h3><p>自由探索也不错！</p></div>';
  }

  // ── Budget ──
  var todayExp = (trip.expenses || []).filter(function(e) { return e.dayId === day.id; }).reduce(function(s, e) { return s + e.amount; }, 0);
  var dailyBudget = trip.budget ? Math.round(parseInt(trip.budget) / (trip.days instanceof Array ? Math.max(1, trip.days.length) : 5)) : 0;
  el = document.getElementById('todayBudgetUsed');
  if (el) el.textContent = '¥' + todayExp.toLocaleString();
  el = document.getElementById('todayBudgetTotal');
  if (el) el.textContent = dailyBudget > 0 ? '今日预算 ¥' + dailyBudget.toLocaleString() : '未设预算';
  el = document.getElementById('todayBudgetLabel');
  if (el && dailyBudget > 0) {
    var pct = Math.round(todayExp / dailyBudget * 100);
    el.textContent = pct + '%';
  }
  var bar = document.getElementById('todayBudgetBar');
  if (bar && dailyBudget > 0) {
    var pct = Math.min(100, Math.round(todayExp / dailyBudget * 100));
    bar.style.width = pct + '%';
    bar.style.background = pct >= 100 ? 'var(--danger)' : pct >= 80 ? 'var(--warning)' : 'var(--success)';
  }

  // ── Day Switcher ──
  el = document.getElementById('daySwitcher');
  if (el) {
    el.innerHTML = trip.days.map(function(d, i) {
      var isToday = d.id === day.id;
      return '<a href="today.html?trip=' + trip.id + '&day=' + d.id + '" style="padding:8px 16px;border-radius:999px;font-size:13px;font-weight:500;text-decoration:none;white-space:nowrap;' +
        (isToday ? 'background:var(--accent);color:#fff;' : 'background:var(--muted);color:var(--muted-fg);') + '">' +
        'Day ' + (i + 1) + (isToday ? ' · 今天' : '') + '</a>';
    }).join('');
  }

  // ── Quick photo ──
  window.quickPhoto = function() {
    var inp = document.getElementById('quickPhotoInput');
    if (inp) inp.click();
  };

  window.handleQuickPhoto = function(input) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      savePhoto(trip.id, e.target.result);
      showToast('照片已保存到旅行日志', 'success');
    };
    reader.readAsDataURL(file);
  };

  window.quickNote = function() {
    var note = prompt('记录一句话...');
    if (note && note.trim()) {
      if (!trip.notes) trip.notes = [];
      trip.notes.push({ text: note.trim(), date: new Date().toISOString(), dayId: day.id });
      saveTrips(loadTrips().map(function(t) { return t.id === trip.id ? trip : t; }));
      showToast('已记录', 'success');
    }
  };
});
