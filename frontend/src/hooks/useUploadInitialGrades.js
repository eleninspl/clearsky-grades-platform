import { useState } from 'react';
import { uploadInitialGrades } from '../api/upload';

export const useUploadInitialGrades = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const upload = async (file) => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadInitialGrades(formData);
      setMessage(res.message || 'Upload successful');
    } catch (err) {
      console.error('❌ Upload error:', err);
      setError(err?.response?.data?.error || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return { upload, loading, message, error };
};
