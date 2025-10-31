import React from 'react';
import { NavLink, useNavigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../App';

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Events', path: '/admin/events' },
    { name: 'Photos', path: '/admin/photos' },
    { name: 'Uploads', path: '/admin/uploads' },
];

export const AdminLayout: React.FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/admin/login');
  };

  return (
    <div className="flex h-screen bg-five16-bg text-five16-text">
      {/* Sidebar */}
      <aside className="w-64 bg-five16-dark flex flex-col">
        <div className="h-16 flex items-center justify-center">
            <NavLink to="/admin/dashboard" className="text-2xl font-bold tracking-wider text-five16-mint">
                FIVE16
            </NavLink>
        </div>
        <nav className="flex-1 px-4 py-4">
          <ul>
            {navItems.map(item => (
              <li key={item.name}>
                <NavLink to={item.path} className={({isActive}) => `flex items-center px-4 py-2 mt-2 rounded-md transition-colors ${isActive ? 'bg-five16-teal text-five16-dark font-semibold' : 'hover:bg-gray-700'}`}>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-700">
            <p className="text-sm text-gray-400">Logged in as</p>
            <p className="font-semibold">{auth.user?.email}</p>
            <p className="text-xs text-five16-mint">{auth.user?.role}</p>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-five16-dark flex items-center justify-between px-6 shadow-md">
            <Link to="/" className="bg-gray-600 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-700 transition-colors">
                Back to Site
            </Link>
            <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                Logout
            </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-five16-bg p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
