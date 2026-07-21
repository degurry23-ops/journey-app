/* Journey — Self-hosted Analytics (lightweight) */

const express = require('express');
const router = express.Router();
const { db, genId } = require('../db');

// POST /api/analytics/track
router.post('/track', (req, res) => {
  const { event, page } = req.body;
  if (!event) return res.status(400).json({ error: 'event required' });

  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim();
  const ua = (req.headers['user-agent'] || '').slice(0, 200);

  try {
    db.analytics.insert({
      id: genId(),
      event: event,
      page: page || '',
      ip: ip,
      ua: ua,
      created: new Date().toISOString()
    });
  } catch(e) { /* silent */ }

  res.json({ ok: true });
});

// GET /api/analytics/stats
router.get('/stats', (req, res) => {
  const events = ['page_view','create_started','create_completed','trip_viewed','today_opened','expense_added','journal_generated','share_clicked','ai_used'];
  const labels = {
    page_view:'页面浏览', create_started:'开始创建', create_completed:'完成创建',
    trip_viewed:'查看行程', today_opened:'Today页', expense_added:'添加记账',
    journal_generated:'生成日志', share_clicked:'点击分享', ai_used:'AI调用'
  };

  const stats = events.map(e => ({
    event: e,
    label: labels[e] || e,
    count: db.analytics.count(e)
  }));

  res.json({
    total: stats.reduce((s, x) => s + x.count, 0),
    events: stats
  });
});

module.exports = router;
