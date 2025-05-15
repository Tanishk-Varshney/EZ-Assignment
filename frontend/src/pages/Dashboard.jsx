import { useState, useEffect } from 'react';
import { FiDownload, FiFile } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';
import { getFiles, downloadFile } from '../services/api';

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      console.log('Fetching files...');
      const response = await getFiles();
      console.log('Files response:', response);
      setFiles(response.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || err.response.data.msg || 'Failed to fetch files');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Failed to fetch files. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (filename) => {
    try {
      console.log('Downloading file:', filename);
      await downloadFile(filename);
    } catch (err) {
      console.error('Error downloading file:', err);
      if (err.response) {
        console.error('Error response:', err.response.data);
        setError(err.response.data.message || err.response.data.msg || 'Failed to download file');
      } else if (err.request) {
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        console.error('Error setting up request:', err.message);
        setError('Failed to download file. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Your Files</h1>
          <p className="text-white/60">Manage and download your shared files</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {files.length === 0 ? (
          <GlassCard>
            <div className="text-center py-12">
              <FiFile className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-white mb-2">No files found</h3>
              <p className="text-white/60">Upload your first file to get started</p>
            </div>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {files.map((file) => (
              <GlassCard key={file.filename} className="transform transition-all hover:scale-[1.02]">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <FiFile className="h-8 w-8 text-white/60" />
                    <div>
                      <h3 className="text-white font-medium truncate max-w-[200px]">
                        {file.filename}
                      </h3>
                      <p className="text-white/60 text-sm">
                        {new Date(file.uploaded_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(file.filename)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
                  >
                    <FiDownload className="h-5 w-5" />
                  </button>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 