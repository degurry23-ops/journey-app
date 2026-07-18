import { useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatDate, formatFullDate, formatMoney } from '../utils/helpers'
import { generateJournal } from '../data/mockAI'

export default function Journal() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips } = useTrips();
  const trip = trips.find(t => t.id === id);

  const journal = useMemo(() => trip ? generateJournal(trip) : null, [trip]);

  if (!trip) return <div className="p-8 text-center text-gray-400">旅行不存在</div>;

  const totalExp = trip.expenses?.reduce((s, e) => s + e.amount, 0) || 0;
  const totalPlaces = trip.days?.reduce((s, d) => s + (d.places?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-8 animate-fade-in">
      {/* Cover */}
      <div className="bg-gradient-to-br from-[#2D6A4F] via-[#52B788] to-[#95D5B2] text-white p-8 pt-16 text-center">
        <button onClick={() => navigate(-1)} className="text-white/70 text-sm mb-6 block text-left">← 返回</button>
        <p className="text-sm opacity-70 mb-2">{formatFullDate(trip.startDate)} - {formatFullDate(trip.endDate)}</p>
        <h1 className="text-3xl font-bold">{trip.destination}之旅</h1>
        <p className="text-lg opacity-80 mt-2">Journey Travel Journal</p>
        <div className="mt-6 w-24 h-0.5 bg-white/30 mx-auto rounded" />
      </div>

      <div className="max-w-lg mx-auto px-4 -mt-4 space-y-4">
        {/* Stats */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">📊 旅行数据</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label:'旅行天数', value:`${trip.days?.length || 0} 天`, icon:'📅' },
              { label:'打卡地点', value:`${totalPlaces} 个`, icon:'📍' },
              { label:'总消费', value:formatMoney(totalExp), icon:'💰' },
              { label:'同行人数', value:`${trip.members?.length || 1} 人`, icon:'👥' },
              { label:'总步行', value:journal?.totalSteps || '-', icon:'👣' },
              { label:'最远打卡', value:journal?.mostDistant || '-', icon:'🏆' },
            ].map(s => (
              <div key={s.label} className="bg-gray-50 rounded-xl p-3">
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
                <p className="font-semibold text-[#2C3E50] mt-0.5">{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Daily recap */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">📖 每日回顾</h3>
          <div className="space-y-4">
            {trip.days?.map((d, i) => (
              <div key={d.id} className="border-l-2 border-[#52B788] pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#2D6A4F] text-white text-xs px-2 py-0.5 rounded-full">Day {i+1}</span>
                  <span className="text-xs text-gray-400">{d.weather}</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {d.places?.map(p => p.name).join(' → ') || '自由探索'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-gradient-to-br from-[#FFF3E0] to-[#F4E4CD] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">🤖</span>
            <h3 className="text-sm font-semibold text-[#E07A5F]">AI 旅行总结</h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{journal?.summary}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {journal?.highlights?.map((h, i) => (
              <span key={i} className="text-xs bg-white/60 px-2.5 py-1 rounded-full text-[#E07A5F]">{h}</span>
            ))}
          </div>
        </div>

        {/* Photo wall placeholder */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-400 mb-4">📷 照片墙</h3>
          <div className="grid grid-cols-3 gap-2">
            {Array.from({length:6}).map((_, i) => (
              <div key={i} className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center text-gray-300 text-2xl">
                📷
              </div>
            ))}
          </div>
        </div>

        {/* Expense chart placeholder */}
        {totalExp > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-400 mb-4">💸 消费分布</h3>
            <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
              {['餐饮','交通','住宿','门票','购物','其他'].map((cat, i) => {
                const amt = trip.expenses?.filter(e => e.cat === cat).reduce((s,e) => s + e.amount, 0) || 0;
                const pct = totalExp > 0 ? (amt / totalExp) * 100 : 0;
                const colors = ['#E07A5F','#457B9D','#2D6A4F','#F4A261','#8B5CF6','#95A5A6'];
                return pct > 0 ? (
                  <div key={cat} style={{width:`${pct}%`, background:colors[i]}} title={`${cat}: ${formatMoney(amt)}`} />
                ) : null;
              })}
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              {['餐饮','交通','住宿','门票','购物','其他'].map((cat, i) => {
                const amt = trip.expenses?.filter(e => e.cat === cat).reduce((s,e) => s + e.amount, 0) || 0;
                const colors = ['#E07A5F','#457B9D','#2D6A4F','#F4A261','#8B5CF6','#95A5A6'];
                return amt > 0 ? (
                  <span key={cat} className="text-xs flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full inline-block" style={{background:colors[i]}} />{cat} {formatMoney(amt)}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        )}

        {/* Share button */}
        <button className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl text-lg font-semibold mt-4 hover:bg-[#1b4332] transition">
          📤 分享旅行日志
        </button>
      </div>
    </div>
  );
}
