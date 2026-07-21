export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

export function formatFullDate(dateStr) {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

export function getDayOfWeek(dateStr) {
  const days = ['周日','周一','周二','周三','周四','周五','周六'];
  return days[new Date(dateStr).getDay()];
}

export function daysBetween(start, end) {
  return Math.ceil((new Date(end) - new Date(start)) / 86400000) + 1;
}

export function formatMoney(amount) {
  return `¥${Number(amount).toLocaleString('zh-CN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

const PLACE_CATEGORIES = ['景点','美食','咖啡','购物','住宿','交通','其他'];
const CATEGORY_ICONS = { '景点':'🏯','美食':'🍜','咖啡':'☕','购物':'🛍','住宿':'🏨','交通':'🚇','其他':'📍' };

export function getCategoryIcon(cat) { return CATEGORY_ICONS[cat] || '📍'; }
export function getCategories() { return PLACE_CATEGORIES; }

export function calcReadiness(trip) {
  let score = 0;
  if (trip.days?.length > 0 && trip.days.some(d => d.places?.length > 0)) score += 30;
  if (trip.hotel) score += 20;
  if (trip.members?.every(m => m.accepted !== false)) score += 15;
  if (trip.days?.some(d => d.budget > 0)) score += 10;
  if (trip.packingConfirmed) score += 10;
  if (trip.days?.some(d => d.weather)) score += 5;
  if (trip.days?.some(d => d.notes)) score += 10;
  return Math.min(100, score);
}
