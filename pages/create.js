/* Journey — Create Trip Page (V3 — AI Travel Planner) */

safeRender(function() {
  var steps = [
    { key: 'destination', q: '想去哪里<span class=\"gradient-text\">旅行</span>？', icon: '🔍', placeholder: '输入目的地', type: 'text', hint: '输入目的地或点击热门推荐' },
    { key: 'startDate', q: '什么时候<span class=\"gradient-text\">出发</span>？', icon: '📅', placeholder: '选择出发日期', type: 'date', hint: '选择出发日期' },
    { key: 'days', q: '准备玩<span class=\"gradient-text\">几天</span>？', icon: '📆', type: 'chips', hint: '选择旅行天数', chips: ['3天','4天','5天','6天','7天','10天'] },
    { key: 'members', q: '<span class=\"gradient-text\">几个人</span>一起？', icon: '👥', type: 'chips', hint: '包括你自己', chips: ['1人','2人','3人','4人','5人+'] },
    { key: 'budget', q: '每人<span class=\"gradient-text\">预算</span>多少？', icon: '💰', type: 'chips', hint: '选择预算范围', chips: ['¥3,000','¥5,000','¥8,000','¥12,000','¥20,000','不限'] },
    { key: 'preferences', q: '喜欢什么<span class=\"gradient-text\">旅行风格</span>？', icon: '🎯', type: 'styleChips', hint: '选一个最符合的', chips: [
      { icon: '🍜', label: '美食探索' }, { icon: '🏯', label: '文化古迹' }, { icon: '🛍', label: '购物逛街' }, { icon: '🌿', label: '自然风光' },
      { icon: '☕', label: '慢节奏体验' }, { icon: '🏃', label: '特种兵打卡' }, { icon: '📸', label: '拍照圣地' }, { icon: '🎭', label: '当地体验' }
    ]}
  ];

  var step = 0;
  var answers = {};
  var chat, planFooter, planInputArea;

  // ── Templates ──
  var templates = [
    { label: '🌸 东京7日', dest: '日本东京', days: '7天', members: '2人', budget: '¥8,000', prefs: '美食探索' },
    { label: '🏔 云南慢旅行', dest: '云南大理', days: '5天', members: '2人', budget: '¥4,000', prefs: '自然风光' },
    { label: '🍜 成都美食', dest: '四川成都', days: '4天', members: '4人', budget: '¥5,000', prefs: '美食探索' },
    { label: '🏙 上海漫步', dest: '上海', days: '3天', members: '1人', budget: '¥3,000', prefs: '慢节奏体验' }
  ];

  var tmplContainer = document.getElementById('templates');
  if (tmplContainer) {
    tmplContainer.innerHTML = templates.map(function(t) {
      return '<span onclick="quickTemplate(\'' + t.dest + '\',\'' + t.days + '\',\'' + t.members + '\',\'' + t.budget + '\',\'' + t.prefs + '\')" style="padding:10px 18px;border-radius:var(--radius-lg);font-size:14px;background:var(--card);cursor:pointer;transition:all .15s;border:1.5px solid var(--border);white-space:nowrap;">' + t.label + '</span>';
    }).join('');
  }

  window.quickTemplate = function(dest, days, members, budget, prefs) {
    startChat();
    var d = new Date(); d.setDate(d.getDate() + 14);
    answers = { destination: dest, startDate: d.toISOString().split('T')[0], days: days, members: members, budget: budget, preferences: prefs };
    step = steps.length;
    addChatMsg('📍 ' + dest + ' · ' + days + ' · ' + members + ' · ' + budget + ' · ' + prefs, 'user');
    generateTrip();
  };

  // ── Start ──
  window.startChat = function() {
    var ob = document.getElementById('onboarding');
    var cp = document.getElementById('chatPhase');
    if (ob) ob.style.display = 'none';
    if (cp) { cp.style.display = 'flex'; cp.style.flexDirection = 'column'; }
    chat = document.getElementById('chat');
    planFooter = document.getElementById('planFooter');
    planInputArea = document.getElementById('planInputArea');
    if (planFooter) planFooter.style.display = 'block';
    addChatMsg(steps[0].q, 'ai');
    renderPlanFooter(0);
    renderStepProgress();
  };

  // ── Chat messages ──
  function addChatMsg(msg, type) {
    if (!chat) return;
    var d = document.createElement('div');
    d.className = type === 'ai' ? 'chat-ai' : 'chat-user';
    var html = type === 'ai' ? '<div class="avatar">✨</div>' : '';
    html += '<div class="bubble">' + msg + '</div>';
    d.innerHTML = html;
    chat.appendChild(d);
    chat.scrollTop = chat.scrollHeight;
  }

  // ── Step progress ──
  function renderStepProgress() {
    var el = document.getElementById('stepProgress');
    if (!el) return;
    var labels = ['目的地','日期','天数','人数','预算','风格'];
    el.innerHTML = labels.map(function(l, i) {
      var done = i < step, current = i === step;
      return '<span style="display:flex;align-items:center;gap:4px;' + (current ? 'color:var(--accent);font-weight:600;' : done ? 'color:var(--success);' : '') + '">' +
        (done ? '✓' : '<span style="width:8px;height:8px;border-radius:50%;background:' + (current ? 'var(--accent)' : 'var(--border)') + ';"></span>') +
        '<span style="white-space:nowrap;">' + l + '</span></span>' +
        (i < labels.length - 1 ? '<span style="color:var(--border);">·</span>' : '');
    }).join('');
  }

  // ── Dynamic footer ──
  function renderPlanFooter(s) {
    if (!planInputArea) return;
    var st = steps[s];
    var html = '';

    if (st.type === 'date') {
      // Date step
      html += '<div style="display:flex;align-items:center;gap:12px;">' +
        '<span style="font-size:24px;">' + st.icon + '</span>' +
        '<input type="date" id="planInput" class="input" style="flex:1;font-size:16px;">' +
        '<button class="btn btn-primary" onclick="nextStep()" style="white-space:nowrap;border-radius:var(--radius-lg);">下一步 <i class="fas fa-arrow-right"></i></button></div>' +
        '<p style="font-size:11px;color:var(--muted-fg);text-align:center;margin-top:8px;">' + st.hint + '</p>';

    } else if (st.type === 'chips' || st.type === 'styleChips') {
      // Chips step — show chips in footer
      html += '<div style="margin-bottom:12px;">';
      st.chips.forEach(function(c) {
        var label = typeof c === 'string' ? c : (c.icon + ' ' + c.label);
        var val = typeof c === 'string' ? c : c.label;
        html += '<span onclick="pickChip(\'' + val + '\', this)" style="display:inline-flex;align-items:center;gap:6px;padding:12px 18px;margin:0 6px 8px 0;border-radius:var(--radius-lg);font-size:15px;background:var(--card);border:1.5px solid var(--border);cursor:pointer;transition:all .15s;">' + label + '</span>';
      });
      html += '</div>';
      html += '<p style="font-size:11px;color:var(--muted-fg);text-align:center;">' + st.hint + '</p>';

    } else {
      // Text step — destination
      html += '<div style="display:flex;align-items:center;gap:12px;">' +
        '<span style="font-size:24px;">' + st.icon + '</span>' +
        '<input type="text" id="planInput" class="input" placeholder="' + st.placeholder + '" style="flex:1;font-size:16px;border:none;background:transparent;padding:12px 0;" autocomplete="off">' +
        '<button class="btn btn-primary" onclick="nextStep()" style="white-space:nowrap;border-radius:var(--radius-lg);">下一步 <i class="fas fa-arrow-right"></i></button></div>';
    }

    planInputArea.innerHTML = html;

    // Focus input if exists
    setTimeout(function() {
      var inp = document.getElementById('planInput');
      if (inp) inp.focus();
    }, 100);
  }

  // ── Chip pick ──
  window.pickChip = function(val, el) {
    // Highlight
    var all = planInputArea.querySelectorAll('span[onclick^=\"pickChip\"]');
    all.forEach(function(s) { s.style.background = 'var(--card)'; s.style.borderColor = 'var(--border)'; s.style.color = 'var(--fg)'; });
    el.style.background = 'var(--accent)'; el.style.borderColor = 'var(--accent)'; el.style.color = '#fff';
    // Store and proceed
    answers[steps[step].key] = val;
    addChatMsg(val, 'user');
    advanceStep();
  };

  // ── Next step ──
  window.nextStep = function() {
    var inp = document.getElementById('planInput');
    if (!inp) return;
    var val = inp.value.trim();
    if (!val) { showToast('请' + steps[step].placeholder, 'warning'); return; }
    answers[steps[step].key] = val;
    addChatMsg(val, 'user');
    advanceStep();
  };

  // ── Advance ──
  function advanceStep() {
    step++;
    renderStepProgress();
    if (step < steps.length) {
      addChatMsg(steps[step].q, 'ai');
      renderPlanFooter(step);
    } else {
      if (planFooter) planFooter.style.display = 'none';
      generateTrip();
    }
  }

  // ── AI Generation ──
  async function generateTrip() {
    addChatMsg('好的！正在为你规划...', 'ai');

    var progDiv = document.createElement('div');
    progDiv.className = 'chat-ai';
    progDiv.innerHTML = '<div class="avatar">✨</div><div class="bubble" id="aiProgress"><p style="font-size:13px;color:var(--muted-fg);">🤖 AI 正在规划中...</p></div>';
    chat.appendChild(progDiv);
    chat.scrollTop = chat.scrollHeight;

    var progressSteps = ['分析最佳旅行时间...','筛选热门地点...','计算路线距离...','生成每日安排...','准备预算方案...'];
    for (var i = 0; i < progressSteps.length; i++) {
      await new Promise(function(r) { setTimeout(r, 400); });
      var pb = document.getElementById('aiProgress');
      if (pb) {
        pb.innerHTML = '<p style="font-size:13px;color:var(--muted-fg);margin-bottom:8px;">🤖 AI 正在规划中...</p>' +
          progressSteps.slice(0, i + 1).map(function(s) { return '<div style="font-size:12px;color:var(--success);margin-top:3px;">✓ ' + s + '</div>'; }).join('');
      }
    }

    var numDays = parseInt(answers.days || 5);
    var numMembers = parseInt(answers.members || 1);
    var numBudget = parseInt(answers.budget || 5000);
    var startDate = answers.startDate || new Date().toISOString().split('T')[0];
    var endDate = new Date(startDate);
    if (isNaN(endDate.getTime())) endDate = new Date();
    endDate.setDate(endDate.getDate() + numDays - 1);
    var endDateStr = endDate.toISOString().split('T')[0];
    var tripDays = null;

    // Try AI API
    try {
      var aiResult = await callAITripPlan({ destination: answers.destination, startDate: startDate, numDays: numDays, members: numMembers, budget: numBudget, preferences: answers.preferences || '' });
      if (aiResult && aiResult.days && aiResult.days.length) {
        tripDays = aiResult.days.map(function(d, i) {
          return { id: 'ai-d' + Date.now() + '-' + i, date: d.date || startDate, weather: d.weather || '☀️ 晴', tip: d.tip || '', places: (d.places || []).map(function(p) {
            return { id: 'ai-p' + Date.now() + '-' + Math.random().toString(36).slice(2,7), name: p.name, cat: p.category || p.cat || '景点', time: p.time_slot || p.time || '09:00', duration: p.duration || '1h', fee: p.fee || '免费', lat: p.lat || null, lng: p.lng || null };
          })};
        });
      }
    } catch(e) {}

    // Fallback
    if (!tripDays || !tripDays.length) {
      var plan = generateTripPlan(answers.destination, startDate, numDays, numMembers, numBudget, answers.preferences);
      tripDays = (plan && plan.days) ? plan.days : [];
    }

    // Error
    if (!tripDays || !tripDays.length) {
      addChatMsg('抱歉，生成失败了。请重试。', 'ai');
      if (planFooter) planFooter.style.display = 'block';
      step = 0; answers = {};
      addChatMsg(steps[0].q, 'ai');
      renderPlanFooter(0);
      renderStepProgress();
      return;
    }

    window._tripData = { name: (answers.destination || '未知') + '之旅', destination: answers.destination || '', startDate: startDate, endDate: endDateStr, members: numMembers, days: tripDays, budget: numBudget, emoji: '🌏', readiness: 30 };

    // Display result
    var html = '<div style="text-align:center;padding:20px 0 32px;">';
    html += '<div style="font-size:48px;margin-bottom:8px;">🎉</div>';
    html += '<h2 style="font-family:var(--font-display);font-size:1.6rem;margin-bottom:4px;">行程已生成！</h2>';
    html += '<p style="color:var(--muted-fg);font-size:13px;">' + (answers.destination || '') + ' · ' + numDays + '天 · ' + startDate + ' 出发</p></div>';

    for (var d = 0; d < tripDays.length; d++) {
      var day = tripDays[d];
      html += '<div class="card animate-in" style="margin-bottom:10px;text-align:left;">';
      html += '<div style="display:flex;gap:8px;align-items:center;margin-bottom:8px;"><span class="tag tag-blue">Day ' + (d+1) + '</span><span style="font-size:13px;color:var(--muted-fg);">' + (day.weather || '☀️ 晴') + '</span></div>';
      if (day.places && day.places.length) {
        day.places.forEach(function(pl) {
          var ci = pl.cat === '美食' ? '🍜' : pl.cat === '咖啡' ? '☕' : pl.cat === '购物' ? '🛍' : pl.cat === '住宿' ? '🏨' : pl.cat === '交通' ? '🚇' : '📍';
          html += '<div style="display:flex;align-items:center;gap:10px;padding:5px 0;font-size:14px;"><span style="font-family:var(--font-mono);font-size:11px;color:var(--muted-fg);min-width:44px;">' + (pl.time || '09:00') + '</span><span>' + ci + '</span><span>' + pl.name + '</span></div>';
        });
      } else {
        html += '<div style="font-size:13px;color:var(--muted-fg);padding:6px 0;">自由探索</div>';
      }
      html += '</div>';
    }
    html += '<button class="btn btn-primary btn-lg btn-full" style="margin-top:16px;" onclick="confirmTrip()">✈️ 确认行程，开始旅程</button>';
    html += '<button class="btn btn-outline btn-full" style="margin-top:8px;" onclick="location.reload()">🔄 重新生成</button>';

    chat.innerHTML = html;
    chat.scrollTop = 0;
  }

  window.confirmTrip = function() {
    if (!window._tripData) return;
    var t = addTrip(window._tripData);
    location.href = 'trip-detail.html?id=' + t.id;
  };

  // Keyboard support
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && planFooter && planFooter.style.display !== 'none') {
      var inp = document.getElementById('planInput');
      if (inp && document.activeElement === inp) { e.preventDefault(); nextStep(); }
    }
  });
});
