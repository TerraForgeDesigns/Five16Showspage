import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@five16.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    // Mock login logic
    if ((email === 'admin@five16.com' || email === 'volunteer@five16.com') && password === 'password') {
      auth.login(email);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@five16.com or volunteer@five16.com with password "password".');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-five16-bg">
      <div className="w-full max-w-md p-8 space-y-6 bg-five16-dark rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-five16-mint">Admin Portal</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-five16-mint">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-five16-teal focus:border-five16-teal"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-five16-mint">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 px-3 py-2 bg-gray-800 border border-gray-600 rounded-md focus:outline-none focus:ring-five16-teal focus:border-five16-teal"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div>
            <button type="submit" className="w-full py-2 px-4 bg-five16-teal text-five16-dark font-bold rounded-md hover:bg-five16-mint transition-colors">
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
