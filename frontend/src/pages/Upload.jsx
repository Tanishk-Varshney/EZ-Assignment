import React from 'react';
import { useNavigate } from 'react-router-dom';
import Upload from '../components/Upload';

const UploadPage = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Upload File</h1>
        <Upload
          onUploadComplete={() => {
            navigate('/dashboard');
          }}
        />
      </div>
    </div>
  );
};

export default UploadPage; 