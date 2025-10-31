import React, { useState, useEffect } from 'react';
import { HardDrive, Home, Clock, Trash2, HardDriveDownload } from 'lucide-react';
import { getStorageInfo } from '../services/files';

function Sidebar({ currentView, onViewChange }) {
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0, percentage: 0 });

  useEffect(() => {
    loadStorageInfo();
  }, []);

  const loadStorageInfo = async () => {
    try {
      const info = await getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Error loading storage info:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const menuItems = [
    { id: 'my-drive', icon: Home, label: 'My Drive' },
    { id: 'recent', icon: Clock, label: 'Recent' },
    { id: 'trash', icon: Trash2, label: 'Trash' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <HardDrive className="w-8 h-8 text-primary mr-2" />
          <h1 className="text-xl font-bold text-gray-800">OpenDrive</h1>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition duration-200 ${
                  currentView === item.id
                    ? 'bg-blue-50 text-primary'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <HardDriveDownload className="w-4 h-4 text-gray-600 mr-2" />
            <span className="text-sm text-gray-600 font-medium">Storage</span>
          </div>
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
              />
            </div>
          </div>
          <p className="text-xs text-gray-600">
            {formatBytes(storageInfo.used)} of {formatBytes(storageInfo.quota)} used
          </p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;