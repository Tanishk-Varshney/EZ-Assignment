import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const endpoint = user.isOps ? '/ops/files' : '/client/files';
      const response = await fetch(`http://localhost:8000${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setFiles(data);
      }
    } catch (error) {
      setError('Failed to fetch files');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/ops/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setSuccess('File uploaded successfully');
        fetchFiles();
      } else {
        setError('Failed to upload file');
      }
    } catch (error) {
      setError('An error occurred during upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">
            {user.isOps ? 'Operations Dashboard' : 'Client Dashboard'}
          </h2>
        </div>

        {user.isOps && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center">
              <label className="block">
                <span className="sr-only">Choose file</span>
                <input
                  type="file"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-md file:border-0
                    file:text-sm file:font-medium
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100"
                  onChange={handleFileUpload}
                  accept=".pptx,.docx,.xlsx"
                  disabled={uploading}
                />
              </label>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-50 border-l-4 border-green-400 text-green-700">
            {success}
          </div>
        )}

        <div className="p-6">
          <div className="grid gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-8 w-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {file.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(file.upload_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <a
                  href={`http://localhost:8000/client/download/${file.download_url}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download
                </a>
              </div>
            ))}

            {files.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No files available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 