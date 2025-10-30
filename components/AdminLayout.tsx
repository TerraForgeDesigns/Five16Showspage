import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../App';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Events', path: '/admin/events' },
    { name: 'Photos', path: '/admin/photos' },
    { name: 'Uploads', path: '/admin/uploads' },
];

const ExternalLinkIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
);

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/admin/login');
  };

  const handleViewPublicSite = () => {
    // Construct the root URL for the HashRouter by taking the part of the URL before any '#'
    const baseUrl = window.location.href.split('#')[0];
    window.open(baseUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex h-screen bg-five16-bg text-five16-text">
      {/* Sidebar */}
      <aside className="w-64 bg-five16-dark flex flex-col">
        <div className="h-16 flex items-center justify-center">
            <NavLink to="/" className="text-2xl font-bold tracking-wider text-five16-mint">
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
          <div className="pt-4 mt-4 border-t border-gray-700">
              <button
                  onClick={handleViewPublicSite}
                  className="w-full flex items-center px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-gray-300 text-left"
              >
                  View Public Site
                  <ExternalLinkIcon />
              </button>
          </div>
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
        <header className="h-16 bg-five16-dark flex items-center justify-end px-6 shadow-md">
            <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors">
                Logout
            </button>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-five16-bg p-8">
          {children}
        </main>
      </div>
    </div>
  );
};