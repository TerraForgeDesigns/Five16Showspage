
import React, { useState, createContext, useContext, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, Role, ToastMessage, Event, Photo } from './types';
import { MOCK_EVENTS } from './data/mockData';
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

// --- EVENTS CONTEXT ---
interface EventsContextType {
  events: Event[];
  addEvent: () => Event;
  updateEvent: (updatedEvent: Event) => void;
  deleteEvent: (eventId: string) => void;
  addPhotosToEvent: (eventId: string, newPhotos: Photo[]) => void;
  getEventBySlug: (slug: string) => Event | undefined;
}
const EventsContext = createContext<EventsContextType>(null!);
export const useEvents = () => useContext(EventsContext);

const EventsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
    const { addToast } = useToasts();

    const addEvent = () => {
        const slug = `untitled-event-${Date.now()}`;
        const newEvent: Event = {
            id: `${Date.now()}`,
            name: 'Untitled Event',
            slug: slug,
            date: new Date(),
            location: 'TBD',
            photos: [],
            published: false,
            writeup: '',
            backgroundImageUrl: '',
            backgroundImageAlt: '',
        };
        setEvents(prev => [newEvent, ...prev]);
        addToast('New event draft created!', 'success');
        return newEvent;
    };
    
    const updateEvent = (updatedEvent: Event) => {
        setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
        addToast('Event saved successfully!', 'success');
    };

    const deleteEvent = (eventId: string) => {
        setEvents(prev => prev.filter(e => e.id !== eventId));
        addToast('Event deleted.', 'success');
    };
    
    const addPhotosToEvent = (eventId: string, newPhotos: Photo[]) => {
        setEvents(prev => prev.map(event => {
            if (event.id === eventId) {
                // Prepend new photos so they appear first in the gallery
                return { ...event, photos: [...newPhotos, ...event.photos] };
            }
            return event;
        }));
    };

    const getEventBySlug = (slug: string) => {
        return events.find(e => e.slug === slug);
    };

    return (
        <EventsContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, getEventBySlug, addPhotosToEvent }}>
            {children}
        </EventsContext.Provider>
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
        <EventsProvider>
            <HashRouter>
            <Routes>
                {/* Public Routes */}
                <Route path="/*" element={<PublicRoutes />} />

                {/* Admin Routes */}
                <Route path="/admin/*" element={<AdminRoutes />} />
                
            </Routes>
            </HashRouter>
        </EventsProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

const PublicRoutes = () => (
    <PublicLayout>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:slug" element={<EventDetailPage />} />
            <Route path="/vendors" element={<VendorsPage />} />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="*" element={<div>404 Not Found</div>} />
        </Routes>
    </PublicLayout>
);

const AdminRoutes = () => (
    <ProtectedRoute>
        <AdminLayout>
            <Routes>
                <Route path="/dashboard" element={<AdminDashboard />} />
                <Route path="/events" element={<EventsManagementPage />} />
                <Route path="/events/edit/:slug" element={<EventEditPage />} />
                <Route path="/photos" element={<PhotosManagementPage />} />
                <Route path="/uploads" element={<UploadsPage />} />
                <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
            </Routes>
        </AdminLayout>
    </ProtectedRoute>
)


export default App;