import { uploadAPI } from '../utils/axiosInstance';

export const uploadInitialGrades = async (file) => {
    const formData = new FormData();
    formData.append('file', file); 
  
    const res = await uploadAPI.post('/initial', formData);
    return res.data;
  };

export const uploadFinalGrades = async (file) => {
    const formData = new FormData();
    formData.append('file', file); 
  
    const res = await uploadAPI.post('/final', formData);
    return res.data;
  };
  