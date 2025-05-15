import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUpload, FiX } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import { uploadFile } from '../services/api';

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setUploading(true);
    setError('');

    try {
      console.log('Uploading file:', file.name);
      await uploadFile(file, (progress) => {
        console.log('Upload progress:', progress);
        setProgress(progress);
      });
      console.log('File uploaded successfully');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error uploading file:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || err.response.data.msg || 'Failed to upload file');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Failed to upload file. Please try again.');
      }
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <GlassCard className="transform transition-all hover:scale-[1.01]">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Upload File</h2>
            <p className="text-white/60">Share your files with others</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="relative">
              <input
                type="file"
                id="file"
                onChange={handleFileChange}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="file"
                className={`
                  block w-full p-8 border-2 border-dashed rounded-lg text-center cursor-pointer
                  transition-colors duration-200
                  ${file ? 'border-green-500/50 bg-green-500/10' : 'border-white/20 hover:border-white/40'}
                  ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {file ? (
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-white truncate">{file.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      className="p-1 hover:bg-white/10 rounded-full transition-colors duration-200"
                    >
                      <FiX className="h-4 w-4 text-white/60" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <FiUpload className="h-8 w-8 text-white/60 mx-auto" />
                    <p className="text-white/60">Click to select a file</p>
                  </div>
                )}
              </label>
            </div>

            {uploading && (
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {uploading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <FiUpload className="mr-2 h-5 w-5" />
                  Upload File
                </>
              )}
            </button>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default Upload; 