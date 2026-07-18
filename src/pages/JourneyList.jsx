import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatDate } from '../utils/helpers'

const TABS = ['全部', '规划中', '进行中', '已完成'];

export default function JourneyList() {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [tab, setTab] = useState('全部');

  const filtered = trips.filter(t => {
    if (tab === '规划中') return t.status === 'planning';
    if (tab === '进行中') return t.status === 'traveling';
    if (tab === '已完成') return t.status === 'completed';
    return true;
  });

  return (
    <div className="pt-4 space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold text-[#2C3E50]">我的旅行</h1>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition ${tab === t ? 'bg-[#2D6A4F] text-white' : 'bg-white text-gray-500'}`}>
            {t} ({trips.filter(tr => t==='全部'?true:t==='规划中'?tr.status==='planning':t==='进行中'?tr.status==='traveling':tr.status==='completed').length})
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📭</p>
          <p>还没有旅行</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map(t => (
          <div key={t.id} onClick={() => navigate(`/trip/${t.id}`)}
            className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-[#2C3E50]">{t.destination}之旅</h3>
                <p className="text-sm text-gray-400">{formatDate(t.startDate)} - {formatDate(t.endDate)} · {t.days?.length || 0}天</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${t.status==='traveling'?'bg-green-100 text-green-700':t.status==='completed'?'bg-gray-100 text-gray-500':'bg-[#FFF3E0] text-[#E07A5F]'}`}>
                {t.status === 'traveling' ? '进行中' : t.status === 'completed' ? '已完成' : '规划中'}
              </span>
            </div>
            {t.days?.length > 0 && (
              <div className="mt-3 flex gap-1.5 overflow-x-auto">
                {t.days.slice(0,5).map((d,i) => (
                  <span key={d.id} className="text-xs bg-gray-50 px-2 py-1 rounded whitespace-nowrap">
                    Day {i+1}: {d.places?.[0]?.name || '待定'}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/create')}
        className="w-full bg-[#2D6A4F] text-white py-4 rounded-2xl text-lg font-semibold mt-4">
        + 创建新旅行
      </button>
    </div>
  );
}
