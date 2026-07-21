import { useParams, useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatDate, calcReadiness, cn } from '../utils/helpers'
import { useToast } from '../components/Toast'

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { trips, dispatch } = useTrips();
  const trip = trips.find(t => t.id === id);

  if (!trip) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-[#94A3B8]">
      <div className="text-center"><p className="text-4xl mb-3">🗺️</p><p>旅行不存在</p></div>
    </div>
  );

  const readiness = calcReadiness(trip);

  const startTravel = () => {
    dispatch({ type:'UPDATE', payload:{ ...trip, status:'traveling', readiness }});
    toast('旅行已开始！✈️', 'success');
  };

  const completeTrip = () => {
    dispatch({ type:'UPDATE', payload:{ ...trip, status:'completed', readiness:100 }});
    toast('旅行已结束，日志已生成 📖', 'success');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 animate-fade-in">
      {/* Header with cover */}
      <div className="relative bg-gradient-to-br from-[#1E3A5F] via-[#2563EB] to-[#60A5FA] text-white">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative p-6 pt-12">
          <button onClick={() => navigate(-1)} className="text-white/60 text-sm mb-4 hover:text-white/90 transition">← 返回</button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{trip.destination}之旅</h1>
              <p className="text-sm text-white/70 mt-1">
                {formatDate(trip.startDate)} - {formatDate(trip.endDate)} · {trip.days?.length || 0}天
              </p>
            </div>
            <span className={cn(
              'px-3 py-1 rounded-full text-xs font-medium',
              trip.status === 'traveling' ? 'bg-green-400/20 text-green-200' :
              trip.status === 'completed' ? 'bg-white/20 text-white/80' :
              'bg-amber-400/20 text-amber-200'
            )}>
              {trip.status === 'traveling' ? '进行中' : trip.status === 'completed' ? '已完成' : '规划中'}
            </span>
          </div>

          {/* Readiness */}
          <div className="mt-5 bg-white/15 rounded-2xl p-4 backdrop-blur">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-white/70">旅行准备度</span>
              <span className="font-bold">{readiness}%</span>
            </div>
            <div className="bg-white/20 rounded-full h-2 overflow-hidden">
              <div className="bg-white h-full rounded-full transition-all duration-700 animate-progress"
                style={{width:`${readiness}%`}} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="max-w-lg mx-auto px-4 -mt-5">
        <div className="card flex gap-3 justify-around !p-4">
          {[
            { label:'地图', icon:'🗺️', to:`/trip/${trip.id}/map` },
            { label:'记账', icon:'💰', to:`/trip/${trip.id}/expenses` },
            { label:'日志', icon:'📖', to:`/trip/${trip.id}/journal` },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.to)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-[#F8FAFC] transition min-w-[70px]">
              <div className="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-xl">{a.icon}</div>
              <span className="text-xs font-medium text-[#64748B]">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Day list */}
      <div className="max-w-lg mx-auto px-4 mt-4 space-y-3">
        <h2 className="text-sm font-bold text-[#64748B] uppercase tracking-wider">行程安排</h2>
        {trip.days?.map((d, i) => (
          <div key={d.id} onClick={() => navigate(`/trip/${trip.id}/day/${d.id}`)}
            className="card card-press cursor-pointer">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#3B82F6] text-white text-xs px-2.5 py-1 rounded-full font-bold">Day {i+1}</span>
                <span className="text-sm">{d.weather || '🌤'}</span>
              </div>
              <span className="text-xs text-[#94A3B8]">{d.places?.length || 0} 个地点 →</span>
            </div>
            {d.places?.length > 0 ? (
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {d.places.map(p => (
                  <span key={p.id} className="text-xs bg-[#F1F5F9] text-[#64748B] px-2 py-1 rounded-lg whitespace-nowrap">
                    {p.time} {p.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#CBD5E1]">还没有安排，点击添加地点</p>
            )}
            {/* AI tip snippet */}
            {d.tip && (
              <div className="mt-2 pt-2 border-t border-[#F1F5F9] flex items-center gap-1 text-[10px] text-[#94A3B8]">
                <span>💡</span>
                <span className="truncate">{d.tip}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Status action */}
      <div className="max-w-lg mx-auto px-4 mt-6">
        {trip.status === 'planning' && (
          <button onClick={startTravel} className="btn btn-primary btn-full btn-lg !bg-gradient-to-r !from-[#3B82F6] !to-[#2563EB]">
            ✈️ 开始旅行
          </button>
        )}
        {trip.status === 'traveling' && (
          <button onClick={completeTrip} className="btn btn-full btn-lg !bg-gradient-to-r !from-[#10B981] !to-[#059669] !text-white">
            🏁 结束旅行，生成日志
          </button>
        )}
        {trip.status === 'completed' && (
          <button onClick={() => navigate(`/trip/${trip.id}/journal`)}
            className="btn btn-primary btn-full btn-lg">
            📖 查看旅行日志
          </button>
        )}
      </div>
    </div>
  );
}
