import React, { createContext, useContext, useState } from 'react';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (name: string, email: string) => void;
  register: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexaprep_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return null; }
    }
    return { name: 'Ektha', email: 'ektham123@gmail.com' };
  });

  const login = (name: string, email: string) => {
    const userObj = { name: name || 'Ektha', email: email || 'ektham123@gmail.com' };
    setUser(userObj);
    localStorage.setItem('nexaprep_user', JSON.stringify(userObj));
  };

  const register = (name: string, email: string) => {
    login(name, email);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('nexaprep_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
