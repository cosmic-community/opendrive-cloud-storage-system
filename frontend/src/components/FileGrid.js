import React, { useState } from 'react';
import { Folder, File, FileText, Image, Download, Trash2, Edit2, ArrowLeft, FolderPlus, RefreshCw } from 'lucide-react';
import { downloadFile, deleteFile, renameFile, trashFile, restoreFile, createFolder, deleteFolder } from '../services/files';

function FileGrid({ files, folders, currentFolder, view, loading, onFolderClick, onBackClick, onRefresh }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(type)) {
      return Image;
    }
    if (['.pdf', '.doc', '.docx', '.txt'].includes(type)) {
      return FileText;
    }
    return File;
  };

  const handleDownload = async (file) => {
    try {
      const response = await downloadFile(file.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };

  const handleDelete = async (file) => {
    if (window.confirm(`Are you sure you want to permanently delete ${file.name}?`)) {
      try {
        await deleteFile(file.id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file');
      }
    }
  };

  const handleTrash = async (file) => {
    try {
      await trashFile(file.id);
      onRefresh();
    } catch (error) {
      console.error('Error moving to trash:', error);
      alert('Failed to move file to trash');
    }
  };

  const handleRestore = async (file) => {
    try {
      await restoreFile(file.id);
      onRefresh();
    } catch (error) {
      console.error('Error restoring file:', error);
      alert('Failed to restore file');
    }
  };

  const handleRename = async (file) => {
    if (!newName.trim()) return;
    
    try {
      await renameFile(file.id, newName);
      setEditingId(null);
      setNewName('');
      onRefresh();
    } catch (error) {
      console.error('Error renaming file:', error);
      alert('Failed to rename file');
    }
  };

  const handleCreateFolder = async () => {
    if (!folderName.trim()) return;
    
    try {
      await createFolder(folderName, currentFolder);
      setCreatingFolder(false);
      setFolderName('');
      onRefresh();
    } catch (error) {
      console.error('Error creating folder:', error);
      alert('Failed to create folder');
    }
  };

  const handleDeleteFolder = async (folder) => {
    if (window.confirm(`Are you sure you want to delete the folder "${folder.name}"? This will also delete all files inside.`)) {
      try {
        await deleteFolder(folder.id);
        onRefresh();
      } catch (error) {
        console.error('Error deleting folder:', error);
        alert('Failed to delete folder');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {currentFolder && (
            <button
              onClick={onBackClick}
              className="flex items-center text-gray-600 hover:text-primary transition duration-200"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
          )}
          <h2 className="text-2xl font-bold text-gray-800">
            {view === 'my-drive' && 'My Drive'}
            {view === 'recent' && 'Recent Files'}
            {view === 'trash' && 'Trash'}
          </h2>
        </div>
        
        <div className="flex items-center space-x-2">
          {view === 'my-drive' && (
            <button
              onClick={() => setCreatingFolder(true)}
              className="flex items-center px-4 py-2 text-primary border border-primary rounded-lg hover:bg-blue-50 transition duration-200"
            >
              <FolderPlus className="w-5 h-5 mr-2" />
              New Folder
            </button>
          )}
          <button
            onClick={onRefresh}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {creatingFolder && (
        <div className="mb-4 p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              autoFocus
            />
            <button
              onClick={handleCreateFolder}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition duration-200"
            >
              Create
            </button>
            <button
              onClick={() => {
                setCreatingFolder(false);
                setFolderName('');
              }}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {folders.length === 0 && files.length === 0 ? (
        <div className="text-center py-12">
          <Folder className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No files or folders yet</p>
          <p className="text-gray-400 text-sm mt-2">Upload files to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={`folder-${folder.id}`}
              className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 p-4 cursor-pointer group"
            >
              <div onClick={() => onFolderClick(folder.id)}>
                <div className="flex items-start justify-between mb-3">
                  <Folder className="w-12 h-12 text-blue-500" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteFolder(folder);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-500 hover:bg-red-50 rounded transition duration-200"
                    title="Delete folder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="font-medium text-gray-800 truncate">{folder.name}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {folder.file_count} files · {folder.subfolder_count} folders
                </p>
              </div>
            </div>
          ))}

          {files.map((file) => {
            const FileIcon = getFileIcon(file.file_type);
            return (
              <div
                key={`file-${file.id}`}
                className="bg-white rounded-lg shadow hover:shadow-lg transition duration-200 p-4 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <FileIcon className="w-12 h-12 text-gray-500" />
                  <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {view === 'trash' ? (
                      <>
                        <button
                          onClick={() => handleRestore(file)}
                          className="p-1 text-green-500 hover:bg-green-50 rounded transition duration-200"
                          title="Restore"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(file)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition duration-200"
                          title="Delete permanently"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleDownload(file)}
                          className="p-1 text-primary hover:bg-blue-50 rounded transition duration-200"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(file.id);
                            setNewName(file.name);
                          }}
                          className="p-1 text-gray-600 hover:bg-gray-100 rounded transition duration-200"
                          title="Rename"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleTrash(file)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded transition duration-200"
                          title="Move to trash"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {editingId === file.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      autoFocus
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleRename(file)}
                        className="flex-1 px-2 py-1 text-xs bg-primary text-white rounded hover:bg-primary-hover transition duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingId(null);
                          setNewName('');
                        }}
                        className="flex-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded transition duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="font-medium text-gray-800 truncate" title={file.name}>
                      {file.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FileGrid;