import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  selectedRole: string;
  setSelectedRole: (role: string) => void;
  isSidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [selectedRole, setSelectedRole] = useState<string>('software-engineer');
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider
      value={{
        selectedRole,
        setSelectedRole,
        isSidebarOpen,
        setSidebarOpen,
        theme,
        toggleTheme
      }}
    >
      <div className={theme === 'dark' ? 'dark bg-slate-950 text-slate-100 min-h-screen' : 'light bg-slate-50 text-slate-800 min-h-screen'}>
        {children}
      </div>
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
