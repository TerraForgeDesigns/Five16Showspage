import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Import providers from their new dedicated files
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { EventsProvider } from './contexts/EventsContext';

// Import layouts and pages
import { PublicLayout } from './layouts/PublicLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { HomePage } from './pages/public/HomePage';
import { EventsPage } from './pages/public/EventsPage';
import { EventDetailPage } from './pages/public/EventDetailPage';
import { VendorsPage } from './pages/public/VendorsPage';
import { LoginPage } from './pages/admin/LoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { EventsManagementPage } from './pages/admin/EventsManagementPage';
import { EventEditPage } from './pages/admin/EventEditPage';
import { PhotosManagementPage } from './pages/admin/PhotosManagementPage';
import { UploadsPage } from './pages/admin/UploadsPage';

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
        <EventsProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<PublicLayout />}>
              <Route index element={<HomePage />} />
              <Route path="events" element={<EventsPage />} />
              <Route path="events/:slug" element={<EventDetailPage />} />
              <Route path="vendors" element={<VendorsPage />} />
              <Route path="admin/login" element={<LoginPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="events" element={<EventsManagementPage />} />
              <Route path="events/edit/:slug" element={<EventEditPage />} />
              <Route path="photos" element={<PhotosManagementPage />} />
              <Route path="uploads" element={<UploadsPage />} />
            </Route>
            
            {/* Not Found Route */}
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center">
                <h1 className="text-3xl font-bold text-five16-mint">404 - Page Not Found</h1>
              </div>
            } />
          </Routes>
        </EventsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
