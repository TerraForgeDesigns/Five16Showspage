
import React from 'react';
import { useAuth } from '../../App';
import { Role } from '../../types';

const StatCard: React.FC<{ title: string; value: string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-five16-dark p-6 rounded-lg flex items-center space-x-4">
        <div className="text-five16-teal">{icon}</div>
        <div>
            <p className="text-gray-400 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
        </div>
    </div>
);

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;

export const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    
    return (
        <div>
            <h1 className="text-3xl font-bold text-five16-mint mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Total Events" value="4" icon={<CalendarIcon />} />
                <StatCard title="Total Photos" value="54" icon={<ImageIcon />} />
                <StatCard title="Your Role" value={user?.role || ''} icon={<UserIcon />} />
            </div>

            <div className="mt-12 bg-five16-dark p-6 rounded-lg">
                <h2 className="text-xl font-bold text-five16-mint mb-4">Welcome, {user?.name}!</h2>
                <p className="text-gray-300">
                    {user?.role === Role.ADMIN ? 
                        "You have full access to manage events, photos, and users." : 
                        "You can upload and manage photos for events."
                    }
                </p>
                <p className="mt-2 text-gray-400">
                    Use the navigation on the left to get started.
                </p>
            </div>
        </div>
    );
};
