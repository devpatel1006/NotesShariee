import React from 'react';
import { User, LogOut, Settings, PenSquare } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LocalStorageService } from '../lib/local-storage';

interface HeaderProps {
  user: any;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <PenSquare className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Notionary
              </h1>
              <p className="text-xs text-gray-500">AI-Powered Note Taking</p>
            </div>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-violet-100 rounded-full flex items-center justify-center">
                <User size={16} className="text-violet-600" />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-sm">{user?.name || 'Guest User'}</p>
                <p className="text-xs text-gray-500">{user?.email || 'guest@example.com'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              
              <button
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                title="Settings"
              >
                <Settings size={18} />
              </button>
              
              <button
                onClick={onLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};