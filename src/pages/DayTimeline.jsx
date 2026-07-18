import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatDate, getDayOfWeek, cn } from '../utils/helpers'
import { getCategoryIcon } from '../utils/helpers'

export default function DayTimeline() {
  const { id, dayId } = useParams();
  const navigate = useNavigate();
  const { trips, dispatch } = useTrips();
  const trip = trips.find(t => t.id === id);
  const day = trip?.days?.find(d => d.id === dayId);
  const dayIndex = trip?.days?.findIndex(d => d.id === dayId);
  const [dragIdx, setDragIdx] = useState(null);

  if (!trip || !day) return <div className="p-8 text-center text-gray-400">数据不存在</div>;

  const handleDragStart = (idx) => setDragIdx(idx);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = (idx) => {
    if (dragIdx === null || dragIdx === idx) return;
    const places = [...day.places];
    const [moved] = places.splice(dragIdx, 1);
    places.splice(idx, 0, moved);
    dispatch({ type:'REORDER_PLACES', payload:{ tripId:trip.id, dayId:day.id, places }});
    setDragIdx(null);
  };

  const removePlace = (placeId) => {
    dispatch({ type:'REMOVE_PLACE', payload:{ tripId:trip.id, dayId:day.id, placeId }});
  };

  const totalSpent = trip.expenses?.filter(e => e.dayId === day.id).reduce((s, e) => s + e.amount, 0) || 0;

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-20 animate-fade-in">
      {/* Top bar */}
      <div className="bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-400 text-sm">← 返回</button>
          <div className="text-center">
            <p className="font-semibold text-[#2C3E50]">Day {dayIndex + 1}</p>
            <p className="text-xs text-gray-400">{formatDate(new Date(trip.startDate).getTime() + dayIndex * 86400000)} {getDayOfWeek(new Date(trip.startDate).getTime() + dayIndex * 86400000)}</p>
          </div>
          <button onClick={() => navigate(`/trip/${trip.id}/map`)} className="text-sm text-[#2D6A4F]">🗺️ 地图</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Weather + Tip */}
        <div className="bg-gradient-to-r from-[#457B9D] to-[#6BB3D9] rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{day.weather?.includes('雨') ? '🌧' : day.weather?.includes('多云') ? '⛅' : '☀️'}</span>
            <div>
              <p className="font-semibold">{day.weather || '☀️ 晴 25°C'}</p>
              <p className="text-sm opacity-85 mt-0.5">{day.tip || '今天天气不错，适合出行~'}</p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <h2 className="text-sm font-semibold text-gray-400 mb-3">今日行程</h2>
          {day.places?.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">📍</p>
              <p>还没有安排，让 AI 帮你规划今天？</p>
            </div>
          )}
          <div className="space-y-2">
            {day.places?.map((place, i) => (
              <div key={place.id}
                draggable
                onDragStart={() => handleDragStart(i)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(i)}
                className={cn(
                  'bg-white rounded-xl p-4 shadow-sm flex items-center gap-3 transition active:scale-[0.98]',
                  dragIdx === i && 'opacity-50 scale-95'
                )}
              >
                {/* Time badge */}
                <div className="text-center min-w-[3rem]">
                  <p className="text-sm font-semibold text-[#2C3E50]">{place.time || '--:--'}</p>
                  <p className="text-[10px] text-gray-400">{place.duration || ''}</p>
                </div>

                {/* Connector line */}
                <div className="w-0.5 h-10 bg-gray-200 rounded-full -mx-1" />

                {/* Place info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span>{getCategoryIcon(place.cat)}</span>
                    <span className="font-medium text-[#2C3E50] truncate">{place.name}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-400">
                    <span>{place.cat || '景点'}</span>
                    {place.fee && <span>· {place.fee}</span>}
                    {place.lat && <span>· 📍 导航</span>}
                  </div>
                </div>

                {/* Remove */}
                <button onClick={() => removePlace(place.id)}
                  className="text-gray-300 hover:text-red-400 text-sm px-2">✕</button>
              </div>
            ))}
          </div>
        </div>

        {/* Today's spending */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">今日消费</span>
            <div className="flex items-center gap-3">
              <span className="font-semibold text-[#2C3E50]">¥{totalSpent.toLocaleString()}</span>
              <button onClick={() => navigate(`/trip/${trip.id}/expenses`)}
                className="text-xs text-[#2D6A4F] bg-[#F0FDF4] px-3 py-1 rounded-full">+ 记账</button>
            </div>
          </div>
        </div>

        {/* Navigation between days */}
        <div className="flex gap-2 pb-4">
          {trip.days?.map((d, i) => (
            <button key={d.id} onClick={() => navigate(`/trip/${trip.id}/day/${d.id}`)}
              className={cn(
                'px-3 py-1.5 rounded-full text-sm transition',
                d.id === dayId ? 'bg-[#2D6A4F] text-white' : 'bg-white text-gray-500'
              )}>
              Day {i+1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
