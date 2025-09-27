import React from 'react';

const FileUpload = ({ onFileUpload, loading }) => {
  return (
    <div className="file-upload">
      <input
        type="file"
        accept=".csv"
        onChange={onFileUpload}
        disabled={loading}
        id="file-input"
      />
      <label htmlFor="file-input" className="file-label">
        {loading ? 'Loading...' : 'Choose CSV File'}
      </label>
    </div>
  );
};

export default FileUpload;