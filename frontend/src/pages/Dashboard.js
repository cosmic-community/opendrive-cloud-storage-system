import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import FileGrid from '../components/FileGrid';
import UploadModal from '../components/UploadModal';
import { getFiles, getFolders } from '../services/files';
import { logout } from '../services/auth';

function Dashboard() {
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [view, setView] = useState('my-drive');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, [currentFolder, view, searchQuery]);

  const loadData = async () => {
    setLoading(true);
    try {
      const params = {};
      
      if (view === 'trash') {
        params.trashed = 'true';
      } else {
        if (currentFolder) {
          params.folder = currentFolder;
        } else {
          params.folder = '';
        }
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }

      const [filesData, foldersData] = await Promise.all([
        getFiles(params),
        view !== 'trash' ? getFolders({ parent: currentFolder || '' }) : Promise.resolve([])
      ]);

      setFiles(filesData);
      setFolders(foldersData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleViewChange = (newView) => {
    setView(newView);
    setCurrentFolder(null);
    setSearchQuery('');
  };

  const handleFolderClick = (folderId) => {
    setCurrentFolder(folderId);
  };

  const handleBackClick = () => {
    setCurrentFolder(null);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        currentView={view} 
        onViewChange={handleViewChange}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onUploadClick={() => setShowUploadModal(true)}
          onLogout={handleLogout}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          <FileGrid
            files={files}
            folders={folders}
            currentFolder={currentFolder}
            view={view}
            loading={loading}
            onFolderClick={handleFolderClick}
            onBackClick={handleBackClick}
            onRefresh={loadData}
          />
        </main>
      </div>

      {showUploadModal && (
        <UploadModal
          currentFolder={currentFolder}
          onClose={() => setShowUploadModal(false)}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}

export default Dashboard;