import React, { useState, useEffect } from 'react';
import { FiUpload, FiRefreshCw } from 'react-icons/fi';
import FileCard from '../components/FileCard';
import Upload from '../components/Upload';
import api from '../utils/api';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [error, setError] = useState('');

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/files');
      setFiles(response.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch files');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDownload = async (file) => {
    try {
      const response = await api.get(`/files/${file.id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', file.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Failed to download file');
    }
  };

  const handleDelete = async (file) => {
    try {
      await api.delete(`/files/${file.id}`);
      await fetchFiles();
    } catch (err) {
      setError('Failed to delete file');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => fetchFiles()}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiRefreshCw className="mr-2 -ml-1 h-5 w-5" />
            Refresh
          </button>
          <button
            onClick={() => setShowUpload(!showUpload)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiUpload className="mr-2 -ml-1 h-5 w-5" />
            Upload
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
          {error}
        </div>
      )}

      {showUpload && (
        <div className="mb-8">
          <Upload
            onUploadComplete={() => {
              setShowUpload(false);
              fetchFiles();
            }}
          />
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No files uploaded yet</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {files.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDownload={handleDownload}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 