
import React, { useState, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Role, ToastMessage } from './types';
import { PublicLayout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';
import { HomePage } from './pages/public/HomePage';
import { EventsPage } from './pages/public/EventsPage';
import { EventDetailPage } from './pages/public/EventDetailPage';
import { VendorsPage } from './pages/public/VendorsPage';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

// --- AUTH CONTEXT ---
interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (email: string) => {
    // Mock login based on email
    if (email === 'admin@five16.com') {
      setUser({ id: 'admin1', email, name: 'Admin User', role: Role.ADMIN });
    } else {
      setUser({ id: 'volunteer1', email, name: 'Volunteer User', role: Role.VOLUNTEER });
    }
  };

  const logout = () => {
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

// --- TOAST CONTEXT ---
interface ToastContextType {
  addToast: (message: string, type: 'success' | 'error') => void;
}
const ToastContext = createContext<ToastContextType>(null!);
export const useToasts = () => useContext(ToastContext);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: 'success' | 'error') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  }, []);
  
  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 space-y-2">
        {toasts.map(toast => (
          <div key={toast.id} className={`px-4 py-2 rounded-md shadow-lg text-white ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};


// --- PROTECTED ROUTE ---
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

// --- APP COMPONENT ---
function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/events" element={<PublicLayout><EventsPage /></PublicLayout>} />
            <Route path="/events/:slug" element={<PublicLayout><EventDetailPage /></PublicLayout>} />
            <Route path="/vendors" element={<PublicLayout><VendorsPage /></PublicLayout>} />

            {/* Admin Routes */}
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute>
                  <AdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<AdminDashboard />} />
                      <Route path="events" element={<div>Events Management Page</div>} />
                      <Route path="photos" element={<div>Photos Management Page</div>} />
                      <Route path="uploads" element={<div>Upload Page</div>} />
                      <Route index element={<Navigate to="dashboard" />} />
                    </Routes>
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
