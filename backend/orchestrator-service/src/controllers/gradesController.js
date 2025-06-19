const axios = require('axios');

const GRADES_SERVICE_URL = process.env.GRADES_SERVICE_URL || 'http://grades-service:5004';

const getStudentGrades = async (req, res) => {
  const { studentId } = req.params;

  try {
    const gradesRes = await axios.get(`${GRADES_SERVICE_URL}/grades/student/${studentId}`, {
      headers: {
        Authorization: req.headers.authorization
      }
    });

    res.json(gradesRes.data);
  } catch (err) {
    console.error(`❌ Failed to fetch grades for student ${studentId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch grades from grades-service' });
  }
};

const getInstructorCourses = async (req, res) => {
  const { instructorId } = req.params;

  try {
    const response = await axios.get(`${GRADES_SERVICE_URL}/grades/instructor/${instructorId}/courses`, {
      headers: {
        Authorization: req.headers.authorization,
      },
    });

    res.json(response.data);
  } catch (err) {
    console.error(`❌ Failed to fetch courses for instructor ${instructorId}:`, err.message);
    res.status(500).json({ error: 'Failed to fetch instructor courses from grades-service' });
  }
};

const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const handleUpload = async (req, res) => {
  const batchType = req.params.type;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  const form = new FormData();
  form.append('file', fs.createReadStream(file.path));

  try {
    const response = await axios.post(
      `${GRADES_SERVICE_URL}/grades/${batchType}`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: req.headers.authorization,
        },
      }
    );

    fs.unlinkSync(file.path); // καθάρισε το tmp αρχείο
    res.status(200).json(response.data);
  } catch (err) {
    console.error('❌ Upload failed via orchestrator:', err.message);
    res.status(500).json({ error: 'Upload failed via orchestrator' });
  }
};


module.exports = {
  getStudentGrades,
  getInstructorCourses,
  handleUpload
};

