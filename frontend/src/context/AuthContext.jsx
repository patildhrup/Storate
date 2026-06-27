import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return data.user;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
