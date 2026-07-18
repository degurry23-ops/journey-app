import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatDate, cn } from '../utils/helpers'

const TABS = ['全部', '规划中', '进行中', '已完成'];

export default function JourneyList() {
  const navigate = useNavigate();
  const { trips } = useTrips();
  const [tab, setTab] = useState('全部');

  const counts = {
    '全部': trips.length,
    '规划中': trips.filter(t => t.status === 'planning').length,
    '进行中': trips.filter(t => t.status === 'traveling').length,
    '已完成': trips.filter(t => t.status === 'completed').length,
  };

  const filtered = trips.filter(t => {
    if (tab === '规划中') return t.status === 'planning';
    if (tab === '进行中') return t.status === 'traveling';
    if (tab === '已完成') return t.status === 'completed';
    return true;
  });

  return (
    <div className="pt-4 space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1E293B]">我的旅行</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn('flex-1 py-2 rounded-lg text-sm font-medium transition',
              tab === t ? 'bg-white text-[#1E293B] shadow-sm' : 'text-[#94A3B8]')}>
            {t} <span className="text-xs ml-0.5">({counts[t]})</span>
          </button>
        ))}
      </div>

      {/* Trip cards */}
      {filtered.length === 0 && (
        <div className="text-center py-20 animate-scale-in">
          <p className="text-5xl mb-4">📭</p>
          <p className="font-medium text-[#94A3B8] mb-4">还没有旅行</p>
          <button onClick={() => navigate('/create')} className="btn btn-primary btn-sm">
            ✨ 创建第一次旅行
          </button>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((t, i) => (
          <div key={t.id} onClick={() => navigate(`/trip/${t.id}`)}
            className="card card-press cursor-pointer animate-fade-in" style={{animationDelay:`${i*0.06}s`}}>
            <div className="flex items-center gap-4">
              <div className={cn(
                'w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm flex-shrink-0',
                t.status === 'traveling' ? 'bg-gradient-to-br from-green-400 to-emerald-500' :
                t.status === 'completed' ? 'bg-gradient-to-br from-blue-400 to-indigo-500' :
                'bg-gradient-to-br from-amber-400 to-orange-400'
              )}>
                {t.status === 'traveling' ? '✈️' : t.status === 'completed' ? '📖' : '📅'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-[#1E293B]">{t.destination}之旅</h3>
                  <span className={cn('tag text-[10px]',
                    t.status === 'traveling' ? 'tag-green' :
                    t.status === 'completed' ? 'tag-blue' : 'tag-amber'
                  )}>
                    {t.status === 'traveling' ? '进行中' : t.status === 'completed' ? '已完成' : '规划中'}
                  </span>
                </div>
                <p className="text-xs text-[#94A3B8] mt-0.5">
                  {formatDate(t.startDate)} - {formatDate(t.endDate)} · {t.days?.length || 0}天 · {t.members?.length || 1}人
                </p>
              </div>
              <span className="text-[#94A3B8] text-lg">→</span>
            </div>
            {/* Day preview chips */}
            {t.days?.length > 0 && (
              <div className="flex gap-1.5 mt-3 ml-16 overflow-x-auto">
                {t.days.slice(0, 4).map((d, i) => (
                  <span key={d.id} className="text-[10px] bg-[#F1F5F9] text-[#64748B] px-2 py-1 rounded-lg whitespace-nowrap">
                    D{i+1}: {d.places?.[0]?.name || '待定'}
                  </span>
                ))}
                {t.days.length > 4 && <span className="text-[10px] text-[#94A3B8] py-1">+{t.days.length-4}</span>}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/create')}
        className="btn btn-primary btn-full btn-lg sticky bottom-4">
        + 创建新旅行
      </button>
    </div>
  );
}
