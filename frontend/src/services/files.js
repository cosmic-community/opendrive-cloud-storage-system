import api from './api';

export const getFiles = async (params = {}) => {
  const response = await api.get('/files/', { params });
  return response.data;
};

export const uploadFile = async (file, folderId = null) => {
  const formData = new FormData();
  formData.append('file', file);
  if (folderId) {
    formData.append('folder', folderId);
  }
  
  const response = await api.post('/upload/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const downloadFile = async (fileId) => {
  const response = await api.get(`/files/${fileId}/download/`, {
    responseType: 'blob',
  });
  return response;
};

export const renameFile = async (fileId, newName) => {
  const response = await api.put(`/files/${fileId}/rename/`, { name: newName });
  return response.data;
};

export const deleteFile = async (fileId) => {
  await api.delete(`/files/${fileId}/`);
};

export const trashFile = async (fileId) => {
  const response = await api.post(`/files/${fileId}/trash/`);
  return response.data;
};

export const restoreFile = async (fileId) => {
  const response = await api.post(`/files/${fileId}/restore/`);
  return response.data;
};

export const getFolders = async (params = {}) => {
  const response = await api.get('/folders/', { params });
  return response.data;
};

export const createFolder = async (name, parentId = null) => {
  const response = await api.post('/folders/', {
    name,
    parent: parentId,
  });
  return response.data;
};

export const deleteFolder = async (folderId) => {
  await api.delete(`/folders/${folderId}/`);
};

export const getStorageInfo = async () => {
  const response = await api.get('/storage/');
  return response.data;
};