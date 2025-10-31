import React, { useState, createContext, useContext } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
