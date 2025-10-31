import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'Events', path: '/events' },
  { name: 'Vendors', path: '/vendors' },
];

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-40 bg-five16-dark/80 backdrop-blur-lg">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <NavLink to="/" className="text-2xl font-bold tracking-wider text-five16-mint">
          FIVE16
        </NavLink>
        <ul className="flex items-center space-x-8">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `relative text-lg font-medium transition-colors hover:text-five16-mint ${
                    isActive ? 'text-five16-mint' : 'text-five16-text'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {item.name}
                    {isActive && (
                      <span className="absolute -bottom-2 left-0 w-full h-1 bg-five16-teal rounded-full"></span>
                    )}
                  </>
                )}
              </NavLink>
            </li>
          ))}
           <li >
             <NavLink to="/admin/login" className="bg-five16-teal text-five16-dark font-bold py-2 px-4 rounded-md hover:bg-five16-mint transition-colors">
                Admin Portal
              </NavLink>
           </li>
        </ul>
      </nav>
    </header>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-five16-dark mt-16">
      <div className="container mx-auto px-6 py-8 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} Five16 Events. All rights reserved.</p>
        <p className="text-sm mt-2">Curating Unforgettable Experiences</p>
      </div>
    </footer>
  );
};

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow"><Outlet /></main>
      <Footer />
    </div>
  );
};
