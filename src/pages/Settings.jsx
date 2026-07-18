import { useTrips } from '../contexts/TripContext'

export default function Settings() {
  const { trips } = useTrips();

  const totalPlaces = trips.reduce((s, t) => s + (t.days?.reduce((ds, d) => ds + (d.places?.length || 0), 0) || 0), 0);
  const completed = trips.filter(t => t.status === 'completed');
  const totalExpenses = trips.reduce((s, t) => s + (t.expenses?.reduce((es, e) => es + e.amount, 0) || 0), 0);

  return (
    <div className="pt-4 space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-[#2C3E50]">我的</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-[#2D6A4F] to-[#52B788] rounded-full flex items-center justify-center text-white text-2xl">
            J
          </div>
          <div>
            <p className="font-semibold text-[#2C3E50]">Journey 旅行者</p>
            <p className="text-sm text-gray-400">探索世界，记录旅程</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-400 mb-4">旅行足迹</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-[#2D6A4F]">{trips.length}</p>
            <p className="text-xs text-gray-400 mt-1">次旅行</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#457B9D]">{totalPlaces}</p>
            <p className="text-xs text-gray-400 mt-1">个地点</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-[#E07A5F]">{completed.length}</p>
            <p className="text-xs text-gray-400 mt-1">本日志</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          { icon:'📋', label:'我的旅行', value:`${trips.length} 个` },
          { icon:'💰', label:'旅行消费总额', value:`¥${totalExpenses.toLocaleString()}` },
          { icon:'📖', label:'旅行日志', value:`${completed.length} 本` },
          { icon:'⭐', label:'收藏的攻略', value:'即将上线' },
          { icon:'⚙️', label:'设置', value:'' },
        ].map((m, i) => (
          <div key={m.label} className={`flex items-center justify-between px-5 py-4 ${i > 0 ? 'border-t border-gray-50' : ''}`}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{m.icon}</span>
              <span className="text-[#2C3E50]">{m.label}</span>
            </div>
            <span className="text-sm text-gray-400">{m.value}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-center text-xs text-gray-300 pb-8">
        Journey — AI Travel Journal · V1.0
      </p>
    </div>
  );
}
