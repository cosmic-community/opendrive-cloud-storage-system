import React from 'react';
import { Search, Upload, LogOut, User } from 'lucide-react';
import { getCurrentUser } from '../services/auth';

function Navbar({ searchQuery, onSearchChange, onUploadClick, onLogout }) {
  const user = getCurrentUser();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search files..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 ml-6">
          <button
            onClick={onUploadClick}
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition duration-200"
          >
            <Upload className="w-5 h-5 mr-2" />
            Upload
          </button>

          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-lg">
            <User className="w-5 h-5 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {user?.username || 'User'}
            </span>
          </div>

          <button
            onClick={onLogout}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;