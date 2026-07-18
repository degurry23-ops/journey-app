import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTrips } from '../contexts/TripContext'
import { formatMoney } from '../utils/helpers'

const CATEGORIES = ['🍜 餐饮','🚇 交通','🏨 住宿','🎫 门票','🛍 购物','☕ 咖啡','💊 其他'];
const CAT_KEYS = ['餐饮','交通','住宿','门票','购物','咖啡','其他'];

export default function Expenses() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { trips, dispatch } = useTrips();
  const trip = trips.find(t => t.id === id);
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState('');
  const [cat, setCat] = useState('餐饮');
  const [note, setNote] = useState('');
  const [payer, setPayer] = useState('我');

  if (!trip) return <div className="p-8 text-center text-gray-400">旅行不存在</div>;

  const expenses = trip.expenses || [];
  const total = expenses.reduce((s, e) => s + e.amount, 0);
  const byCat = CAT_KEYS.map(k => ({ cat:k, total:expenses.filter(e => e.cat === k).reduce((s,e) => s + e.amount, 0) })).filter(c => c.total > 0);
  const perPerson = total / (trip.members?.length || 1);

  const handleAdd = () => {
    if (!amount || parseFloat(amount) <= 0) return;
    dispatch({ type:'ADD_EXPENSE', payload:{ tripId:trip.id, expense:{ amount:parseFloat(amount), cat, note, payer, date:new Date().toISOString() }}});
    setAmount(''); setNote(''); setShowForm(false);
  };

  const handleRemove = (expenseId) => {
    dispatch({ type:'REMOVE_EXPENSE', payload:{ tripId:trip.id, expenseId }});
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-24 animate-fade-in">
      {/* Top bar */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-gray-400 text-sm">← 返回</button>
          <h1 className="font-semibold text-[#2C3E50]">旅行记账</h1>
          <div />
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        {/* Summary card */}
        <div className="bg-gradient-to-br from-[#E07A5F] to-[#F4A261] rounded-2xl p-5 text-white">
          <p className="text-sm opacity-80">总消费</p>
          <p className="text-3xl font-bold mt-1">{formatMoney(total)}</p>
          <div className="flex gap-4 mt-3 text-sm opacity-85">
            <span>👥 {trip.members?.length || 1}人</span>
            <span>人均 {formatMoney(perPerson)}</span>
          </div>
        </div>

        {/* Category breakdown */}
        {byCat.length > 0 && (
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">分类统计</h3>
            <div className="space-y-2">
              {byCat.map(c => (
                <div key={c.cat} className="flex items-center justify-between text-sm">
                  <span>{c.cat}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-100 rounded-full h-1.5">
                      <div className="bg-[#E07A5F] h-1.5 rounded-full" style={{width:`${(c.total/total)*100}%`}} />
                    </div>
                    <span className="text-gray-500 w-16 text-right">{formatMoney(c.total)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Expense list */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-400">消费明细</h3>
          {expenses.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <p className="text-4xl mb-2">💳</p>
              <p>还没有消费记录</p>
            </div>
          )}
          {[...expenses].reverse().map(e => (
            <div key={e.id} className="bg-white rounded-xl p-4 shadow-sm flex items-center justify-between">
              <div>
                <p className="font-medium text-[#2C3E50]">{e.cat} {e.note && `· ${e.note}`}</p>
                <p className="text-xs text-gray-400">{e.payer} 支付</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatMoney(e.amount)}</span>
                <button onClick={() => handleRemove(e.id)} className="text-gray-300 hover:text-red-400 text-sm">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add button */}
      {!showForm ? (
        <button onClick={() => setShowForm(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#E07A5F] text-white rounded-full text-2xl shadow-lg hover:bg-[#c96a52] transition z-20">
          +
        </button>
      ) : (
        <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl p-6 z-20 animate-fade-in">
          <div className="max-w-lg mx-auto space-y-4">
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCat(c.slice(3))}
                  className={`px-3 py-1.5 rounded-full text-sm transition ${cat === c.slice(3) ? 'bg-[#E07A5F] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  {c}
                </button>
              ))}
            </div>
            <input type="number" value={amount} onChange={e => setAmount(e.target.value)}
              placeholder="金额 (¥)" className="w-full bg-gray-50 rounded-xl px-4 py-3 text-lg focus:outline-none" autoFocus />
            <input type="text" value={note} onChange={e => setNote(e.target.value)}
              placeholder="备注（可选）" className="w-full bg-gray-50 rounded-xl px-4 py-3 focus:outline-none" />
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-gray-500">取消</button>
              <button onClick={handleAdd} className="flex-1 bg-[#E07A5F] text-white py-3 rounded-xl font-semibold">添加</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
