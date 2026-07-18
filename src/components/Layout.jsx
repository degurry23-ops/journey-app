import { Outlet, NavLink, useLocation } from 'react-router-dom'

const tabs = [
  { to: '/', icon: '🏠', label: 'Home' },
  { to: '/journeys', icon: '🗺️', label: 'Journey' },
  { to: '/settings', icon: '👤', label: 'Me' },
];

export default function Layout() {
  const location = useLocation();
  const isInner = location.pathname !== '/' && location.pathname !== '/journeys' && location.pathname !== '/settings';

  return (
    <div className="min-h-screen bg-[#FFF8F0] pb-16">
      <main className="max-w-lg mx-auto px-4 pt-4">
        <Outlet />
      </main>
      {!isInner && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-gray-200 z-50">
          <div className="max-w-lg mx-auto flex justify-around py-2">
            {tabs.map(t => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center px-4 py-1 rounded-lg transition ${isActive ? 'text-[#2D6A4F]' : 'text-gray-400'}`
                }
              >
                <span className="text-xl">{t.icon}</span>
                <span className="text-xs mt-0.5">{t.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
}
