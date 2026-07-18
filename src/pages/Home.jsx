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
  const hour = today.getHours();
  const greeting = hour < 12 ? '早上好 ☀️' : hour < 18 ? '下午好 🌤' : '晚上好 🌙';

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-[#94A3B8] tracking-wider uppercase">{formatFullDate(today.toISOString())}</p>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] mt-0.5">{greeting}</h1>
        </div>
        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#2563EB] flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200">
          J
        </div>
      </div>

      {/* Countdown + Quick Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Countdown Card */}
        {next ? (
          <div onClick={() => navigate(`/trip/${next.id}`)}
            className="md:col-span-2 relative overflow-hidden bg-gradient-to-br from-[#1E3A5F] via-[#2563EB] to-[#60A5FA] rounded-3xl p-6 md:p-8 text-white cursor-pointer active:scale-[0.98] transition-transform">
            <div className="absolute top-4 right-6 text-8xl opacity-10">🗺️</div>
            <p className="text-sm opacity-80 font-medium">距离下一次旅行</p>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-6xl md:text-7xl font-bold tracking-tighter">
                {Math.max(0, daysBetween(today.toISOString().split('T')[0], next.startDate))}
              </span>
              <span className="text-xl opacity-80">天</span>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <span className="text-2xl">🎌</span>
              <div>
                <p className="font-semibold text-lg">{next.destination}之旅</p>
                <p className="text-sm opacity-75">{formatDate(next.startDate)} - {formatDate(next.endDate)} · {next.days?.length || 0}天</p>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <div className="flex-1 bg-white/20 rounded-full h-2 overflow-hidden">
                <div className="bg-white h-full rounded-full transition-all duration-700" style={{width:`${next.readiness || 15}%`}} />
              </div>
              <span className="text-sm font-medium">{next.readiness || 15}%</span>
            </div>
          </div>
        ) : (
          <div className="md:col-span-2 bg-gradient-to-br from-[#EFF6FF] to-white rounded-3xl p-8 border-2 border-dashed border-[#DBEAFE] flex flex-col items-center justify-center text-center">
            <p className="text-6xl mb-4 animate-float">🗺️</p>
            <h2 className="text-xl font-bold text-[#1E293B] mb-2">开启你的第一段旅程</h2>
            <p className="text-[#94A3B8] text-sm">AI 帮你规划路线 · 记录每个瞬间 · 珍藏整段旅行</p>
          </div>
        )}

        {/* Stats mini card */}
        <div className="card flex flex-col justify-center items-center text-center gap-3 !p-6">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div>
              <p className="text-3xl font-bold text-[#3B82F6]">{trips.length}</p>
              <p className="text-xs text-[#94A3B8] mt-1">次旅行</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#10B981]">{active.length}</p>
              <p className="text-xs text-[#94A3B8] mt-1">进行中</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#8B5CF6]">{completed.length}</p>
              <p className="text-xs text-[#94A3B8] mt-1">已完成</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-[#F59E0B]">{upcoming.length}</p>
              <p className="text-xs text-[#94A3B8] mt-1">即将出发</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Trips */}
      {active.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <h2 className="text-lg font-bold text-[#1E293B]">正在进行</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {active.map(t => (
              <div key={t.id} onClick={() => navigate(`/trip/${t.id}`)}
                className="card card-press card-hover cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-2xl shadow-sm">✈️</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1E293B]">{t.destination}之旅</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{formatDate(t.startDate)} - {formatDate(t.endDate)} · {t.members?.length || 1}人</p>
                  </div>
                  <span className="tag tag-green">进行中</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Upcoming */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">即将出发</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {upcoming.map(t => (
              <div key={t.id} onClick={() => navigate(`/trip/${t.id}`)}
                className="card card-press card-hover cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#3B82F6] to-[#60A5FA] flex items-center justify-center text-2xl shadow-sm">📅</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[#1E293B]">{t.destination}之旅</p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">{formatDate(t.startDate)} - {formatDate(t.endDate)} · {t.days?.length || 0}天</p>
                  </div>
                  <span className="tag tag-amber">准备中</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-[#1E293B] mb-4">旅行日志</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {completed.map(t => (
              <div key={t.id} onClick={() => navigate(`/trip/${t.id}/journal`)}
                className="card card-press card-hover cursor-pointer min-w-[160px] flex-shrink-0 text-center !p-5">
                <p className="text-3xl mb-2">📖</p>
                <p className="font-bold text-sm text-[#1E293B]">{t.destination}</p>
                <p className="text-[10px] text-[#94A3B8] mt-0.5">{t.days?.length || 0}天 · {formatDate(t.startDate)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Create */}
      <button onClick={() => navigate('/create')}
        className="btn btn-primary btn-full btn-lg !py-5 !text-lg !rounded-2xl !shadow-lg !shadow-blue-200">
        + 创建新旅行
      </button>

      <p className="text-center text-[10px] text-[#CBD5E1] pt-2">Journey · AI Travel Journal</p>
    </div>
  );
}
