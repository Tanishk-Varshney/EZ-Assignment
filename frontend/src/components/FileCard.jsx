import React from 'react';
import { FiDownload, FiTrash2, FiFile } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

const FileCard = ({ file, onDownload, onDelete }) => {
  const getFileIcon = () => {
    // Add more file type checks as needed
    return <FiFile className="w-8 h-8 text-blue-500" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          {getFileIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {file.name}
          </h3>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:space-x-6">
            <p className="text-sm text-gray-500">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
            <p className="text-sm text-gray-500">
              Uploaded {formatDistanceToNow(new Date(file.uploadDate), { addSuffix: true })}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0 flex space-x-2">
          <button
            onClick={() => onDownload(file)}
            className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50 transition-colors duration-200"
            title="Download file"
          >
            <FiDownload className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(file)}
            className="p-2 text-red-600 hover:text-red-800 rounded-full hover:bg-red-50 transition-colors duration-200"
            title="Delete file"
          >
            <FiTrash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileCard; 