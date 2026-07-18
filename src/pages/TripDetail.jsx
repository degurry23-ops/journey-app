import { useParams, useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatDate, calcReadiness } from '../utils/helpers'

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, dispatch } = useTrips();
  const trip = trips.find(t => t.id === id);

  if (!trip) return <div className="p-8 text-center text-gray-400">旅行不存在</div>;

  const readiness = calcReadiness(trip);

  const startTravel = () => {
    dispatch({ type:'UPDATE', payload:{ ...trip, status:'traveling', readiness }});
  };

  const completeTrip = () => {
    dispatch({ type:'UPDATE', payload:{ ...trip, status:'completed', readiness:100 }});
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#2D6A4F] to-[#52B788] text-white p-6 pt-12">
        <button onClick={() => navigate(-1)} className="text-white/70 text-sm mb-4">← 返回</button>
        <h1 className="text-2xl font-bold">{trip.destination}之旅</h1>
        <p className="text-sm opacity-80 mt-1">
          {formatDate(trip.startDate)} - {formatDate(trip.endDate)} · {trip.days?.length || 0}天 · 👥 {trip.members?.length || 1}人
        </p>
        {/* Readiness */}
        <div className="mt-4 bg-white/20 rounded-xl p-4">
          <div className="flex justify-between text-sm mb-1">
            <span>旅行准备度</span>
            <span className="font-semibold">{readiness}%</span>
          </div>
          <div className="bg-white/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all duration-700" style={{width:`${readiness}%`}} />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="px-4 -mt-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 justify-around">
          {[
            { label:'地图', icon:'🗺️', to:`/trip/${trip.id}/map` },
            { label:'记账', icon:'💰', to:`/trip/${trip.id}/expenses` },
            { label:'旅行日志', icon:'📖', to:`/trip/${trip.id}/journal` },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.to)}
              className="flex flex-col items-center gap-1 text-sm text-gray-600 hover:text-[#2D6A4F] transition">
              <span className="text-2xl">{a.icon}</span>
              <span>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Day list */}
      <div className="px-4 mt-4 space-y-3">
        <h2 className="text-lg font-semibold text-[#2C3E50]">行程安排</h2>
        {trip.days?.map((d, i) => (
          <div key={d.id} onClick={() => navigate(`/trip/${trip.id}/day/${d.id}`)}
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition active:scale-[0.98]">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#2D6A4F] text-white text-xs px-2.5 py-1 rounded-full font-medium">Day {i+1}</span>
                <span className="text-sm">{d.weather || '🌤'}</span>
              </div>
              <span className="text-xs text-gray-400">{d.places?.length || 0} 个地点 →</span>
            </div>
            {d.places?.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {d.places.map((p, pi) => (
                  <span key={p.id} className="text-xs bg-gray-50 px-2 py-1 rounded text-gray-500">
                    {p.time} {p.name}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-300">还没有安排，点击添加地点</p>
            )}
          </div>
        ))}
      </div>

      {/* Status actions */}
      <div className="fixed bottom-0 left-0 right-0 px-4 py-4 bg-gradient-to-t from-[#FFF8F0] via-[#FFF8F0]">
        <div className="max-w-lg mx-auto">
          {trip.status === 'planning' && (
            <button onClick={startTravel} className="w-full bg-[#E07A5F] text-white py-4 rounded-2xl text-lg font-semibold hover:bg-[#c96a52] transition">
              ✈️ 开始旅行
            </button>
          )}
          {trip.status === 'traveling' && (
            <button onClick={completeTrip} className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl text-lg font-semibold hover:bg-[#1b4332] transition">
              🏁 结束旅行，生成日志
            </button>
          )}
          {trip.status === 'completed' && (
            <button onClick={() => navigate(`/trip/${trip.id}/journal`)}
              className="w-full bg-[#457B9D] text-white py-4 rounded-2xl text-lg font-semibold">
              📖 查看旅行日志
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
