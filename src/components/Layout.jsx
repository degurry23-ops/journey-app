import { Outlet, NavLink, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/journeys', icon: '🗺️', label: 'Journey' },
  { to: '/settings', icon: '👤', label: 'Me' },
];

export default function Layout() {
  const location = useLocation();
  const isInner = !['/', '/journeys', '/settings'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <main className="max-w-lg mx-auto px-4 pt-4">
        <Outlet />
      </main>
      {!isInner && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-[#E2E8F0] z-50 safe-bottom">
          <div className="max-w-lg mx-auto flex justify-around py-2">
            {tabs.map(t => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center px-5 py-1.5 rounded-xl transition-all ${
                    isActive ? 'text-[#3B82F6]' : 'text-[#94A3B8] hover:text-[#64748B]'
                  }`
                }
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-[10px] font-medium mt-0.5">{t.label}</span>
                {({ isActive }) => isActive && (
                  <span className="block w-1 h-1 rounded-full bg-[#3B82F6] mt-0.5" />
                )}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
