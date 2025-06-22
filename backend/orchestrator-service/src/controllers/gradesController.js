const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const GRADES_SERVICE_URL = process.env.GRADES_SERVICE_URL || 'http://grades-service:5004';

// 📊 Δημόσια στατιστικά
exports.getQuestionKeys = async (req, res) => {
  try {
    const { courseId, type } = req.params;
    const response = await axios.get(`${GRADES_SERVICE_URL}/grades/questions/${courseId}/${type}`);    
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error fetching question keys:', err.message);
    res.status(500).json({ error: 'Failed to fetch question keys' });
  }
};

exports.getTotalDistribution = async (req, res) => {
  try {
    const { courseId, type } = req.params;
    const response = await axios.get(`${GRADES_SERVICE_URL}/grades/distribution/${courseId}/${type}`);    
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error fetching total distribution:', err.message);
    res.status(500).json({ error: 'Failed to fetch total distribution' });
  }
};

exports.getQuestionDistribution = async (req, res) => {
  try {
    const { courseId, type, question } = req.params;
    const response = await axios.get(`${GRADES_SERVICE_URL}/grades/distribution/${courseId}/${type}/q/${question}`);    
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error fetching question distribution:', err.message);
    res.status(500).json({ error: 'Failed to fetch question distribution' });
  }
};

// Υφιστάμενες συναρτήσεις
exports.getStudentGrades = async (req, res) => {
  const { studentId } = req.params;
  // Debug log
  console.log(`[DEBUG] getStudentGrades called for studentId: ${studentId}, headers:`, req.headers);

  try {
    const gradesRes = await axios.get(`${GRADES_SERVICE_URL}/grades/student/${studentId}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(gradesRes.data);
  } catch (err) {
    console.error(`❌ Failed to fetch grades for student ${studentId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch grades' });
  }
};

exports.getInstructorCourses = async (req, res) => {
  const { instructorId } = req.params;
  try {
    const response = await axios.get(`${GRADES_SERVICE_URL}/grades/instructor/${instructorId}/courses`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error(`❌ Failed to fetch courses for instructor ${instructorId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
};

exports.handleUpload = async (req, res) => {
  const { type } = req.params;

  try {
    const form = new FormData();
    form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

    const response = await axios.post(`${GRADES_SERVICE_URL}/grades/${type}`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: req.headers.authorization
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('❌ Upload failed:', err.message);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};