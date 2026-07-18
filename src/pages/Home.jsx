import { useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatDate, formatFullDate, daysBetween } from '../utils/helpers'

export default function Home() {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const active = trips.filter(t => t.status === 'traveling');
  const upcoming = trips.filter(t => t.status === 'planning');
  const completed = trips.filter(t => t.status === 'completed');
  const next = upcoming[0];

  const today = new Date();
  const greetings = ['早上好 ☀️', '下午好 🌤', '晚上好 🌙'];
  const hour = today.getHours();
  const greeting = hour < 12 ? greetings[0] : hour < 18 ? greetings[1] : greetings[2];

  return (
    <div className="space-y-5 animate-fade-in pb-4">
      {/* Header */}
      <div className="pt-2">
        <p className="text-xs text-[#95A5A6] tracking-wider uppercase">
          {formatFullDate(today.toISOString())}
        </p>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-[28px] font-bold text-[#2C3E50] tracking-tight">
            {greeting}
          </h1>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#52B788] flex items-center justify-center text-white text-sm font-bold">
            J
          </div>
        </div>
        {active.length > 0 && (
          <p className="text-sm text-[#52B788] font-medium mt-0.5">旅途愉快 ✈️</p>
        )}
      </div>

      {/* Countdown Card */}
      {next && (
        <div onClick={() => navigate(`/trip/${next.id}`)}
          className="relative overflow-hidden bg-gradient-to-br from-[#2D6A4F] via-[#40916C] to-[#52B788] rounded-3xl p-6 text-white cursor-pointer active:scale-[0.98] transition-transform">
          <div className="absolute top-3 right-4 text-6xl opacity-10">🗺️</div>
          <p className="text-sm opacity-80 font-medium">距离下一次旅行</p>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-6xl font-bold tracking-tighter">
              {Math.max(0, daysBetween(today.toISOString().split('T')[0], next.startDate))}
            </span>
            <span className="text-lg opacity-80">天</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-xl">🎌</span>
            <div>
              <p className="font-semibold">{next.destination}之旅</p>
              <p className="text-sm opacity-75">{formatDate(next.startDate)} - {formatDate(next.endDate)} · {next.days?.length || 0}天</p>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <div className="flex-1 bg-white/20 rounded-full h-1.5 overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all duration-700" style={{width:`${next.readiness || 15}%`}} />
            </div>
            <span className="text-xs opacity-70">{next.readiness || 15}%</span>
          </div>
        </div>
      )}

      {/* No trips */}
      {trips.length === 0 && (
        <div className="text-center py-10 animate-scale-in">
          <div className="text-7xl animate-float mb-6">🗺️</div>
          <h2 className="text-xl font-bold text-[#2C3E50] mb-2">开启你的第一段旅程</h2>
          <p className="text-sm text-[#95A5A6] leading-relaxed mb-2">
            AI 帮你规划路线 · 记录每个瞬间 · 珍藏整段旅行
          </p>
          <div className="flex justify-center gap-3 mt-6 text-3xl">
            <span className="animate-float" style={{animationDelay:'0s'}}>✈️</span>
            <span className="animate-float" style={{animationDelay:'0.3s'}}>📸</span>
            <span className="animate-float" style={{animationDelay:'0.6s'}}>🗺️</span>
          </div>
        </div>
      )}

      {/* Active trips */}
      {active.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-[#2C3E50]">正在进行</h2>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
          {active.map((t, i) => (
            <div key={t.id} onClick={() => navigate(`/trip/${t.id}`)}
              className="card card-hover cursor-pointer mb-3 animate-fade-in" style={{animationDelay:`${i*0.1}s`}}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#F4A261] flex items-center justify-center text-2xl shadow-sm">
                  ✈️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#2C3E50]">{t.destination}之旅</p>
                  <p className="text-xs text-[#95A5A6] mt-0.5">
                    {formatDate(t.startDate)} - {formatDate(t.endDate)} · {t.members?.length || 1}人同行
                  </p>
                </div>
                <span className="tag tag-green">进行中</span>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[#2C3E50] mb-3">即将出发</h2>
          {upcoming.map((t, i) => (
            <div key={t.id} onClick={() => navigate(`/trip/${t.id}`)}
              className="card card-hover cursor-pointer mb-3 animate-fade-in" style={{animationDelay:`${i*0.1}s`}}>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#457B9D] to-[#6BB3D9] flex items-center justify-center text-2xl shadow-sm">
                  📅
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#2C3E50]">{t.destination}之旅</p>
                  <p className="text-xs text-[#95A5A6] mt-0.5">
                    {formatDate(t.startDate)} - {formatDate(t.endDate)} · {t.days?.length || 0}天
                  </p>
                </div>
                <span className="tag tag-orange">准备中</span>
              </div>
              {t.days?.length > 0 && (
                <div className="flex gap-1.5 mt-3 overflow-x-auto pb-1">
                  {t.days.slice(0, 5).map((d, i) => (
                    <span key={d.id} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-full whitespace-nowrap">
                      D{i+1}: {d.places?.[0]?.name || '待定'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[#2C3E50] mb-3">旅行日志</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {completed.slice(0, 5).map(t => (
              <div key={t.id} onClick={() => navigate(`/trip/${t.id}/journal`)}
                className="card card-hover cursor-pointer min-w-[140px] flex-shrink-0 text-center">
                <p className="text-3xl mb-2">📖</p>
                <p className="font-semibold text-sm text-[#2C3E50]">{t.destination}</p>
                <p className="text-[10px] text-[#95A5A6] mt-0.5">{t.days?.length || 0}天行程</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create button */}
      <button onClick={() => navigate('/create')}
        className="btn-primary w-full text-center flex items-center justify-center gap-2 !py-4 !text-lg !rounded-2xl">
        <span className="text-xl">+</span> 创建新旅行
      </button>

      {/* Footer */}
      <p className="text-center text-[10px] text-[#c0bdb5] pt-2">
        Journey · AI Travel Journal
      </p>
    </div>
  );
}
