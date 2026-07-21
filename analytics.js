/* Journey — Frontend Analytics Tracker */

(function() {
  var API_BASE = window.location.origin;
  if (API_BASE.indexOf(':8080') >= 0) API_BASE = API_BASE.replace(':8080', ':3001');
  if (!API_BASE.match(/:\d+/)) API_BASE += ':3001';

  // Don't track local dev
  if (API_BASE.indexOf('localhost') >= 0 || API_BASE.indexOf('127.0.0.1') >= 0) return;

  function track(event, page) {
    page = page || window.location.pathname.replace('/', '') || 'index';
    try {
      fetch(API_BASE + '/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: event, page: page })
      }).catch(function() {});
    } catch(e) {}
  }

  // Auto-track page views
  track('page_view');

  // Expose for manual tracking
  window.track = track;
})();
