const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const { publishGradesUploaded } = require('../rabbitmq/publishers/gradesPublisher');

const GRADES_SERVICE_URL = process.env.GRADES_SERVICE_URL || 'http://grades-service:5004';

// 📊 Δημόσια στατιστικά
exports.getQuestionKeys = async (req, res) => {
  try {
    const { courseId, type } = req.params;
    const response = await axios.get(
      `${GRADES_SERVICE_URL}/grades/questions/${courseId}/${type}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error fetching question keys:', err.message);
    res.status(500).json({ error: 'Failed to fetch question keys' });
  }
};


exports.getTotalDistribution = async (req, res) => {
  try {
    const { courseId, type } = req.params;
    const response = await axios.get(
      `${GRADES_SERVICE_URL}/grades/distribution/${courseId}/${type}`,
      {
        headers: {
          Authorization: req.headers.authorization,
        },
      }
    );
    res.json(response.data);
  } catch (err) {
    console.error('❌ Error fetching total distribution:', err.message);
    res.status(500).json({ error: 'Failed to fetch total distribution' });
  }
};

exports.getQuestionDistribution = async (req, res) => {
  try {
    const { courseId, type, question } = req.params;
    const response = await axios.get(
      `${GRADES_SERVICE_URL}/grades/distribution/${courseId}/${type}`,
      {
        headers: {
          Authorization: req.headers.authorization
        }
      }
    );
    
    
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

  // 📁 Δημιουργία φόρμας multipart για upload
  const form = new FormData();
  form.append('file', fs.createReadStream(req.file.path), req.file.originalname);

  try {
    // 📡 Κάνε POST στο grades service
    const response = await axios.post(
      `${GRADES_SERVICE_URL}/grades/${type}`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          Authorization: req.headers.authorization
        }
      }
    );

    // 🔔 Αν υπάρξουν στοιχεία, στείλε στο RabbitMQ
    const institution_id = response.data?.institution_id;
    const uploadType = type?.toUpperCase();
    
    // 📣 Publish μόνο αν είναι αρχικό batch
    if (uploadType === 'INITIAL' && institution_id) {
      await publishGradesUploaded({ institution_id });
    } else if (uploadType !== 'INITIAL') {
      console.log(`ℹ️ Δεν έγινε publish γιατί το batch type είναι '${uploadType}', όχι 'INITIAL'`);
    } else {
      console.warn('⚠️ Missing data for publishing grades_uploaded:', { institution_id });
    }

    // ✅ Επέστρεψε την απάντηση από το grades service στον client
    res.status(response.status).json(response.data);

  } catch (err) {
    console.error('❌ Upload failed:', err.message);

    const statusCode = err.response?.status || 500;
    const errorMessage =
      err.response?.data?.error ||
      err.response?.data?.message ||
      'Σφάλμα κατά την αποστολή βαθμών.';

    res.status(statusCode).json({
      error: errorMessage
    });

  } finally {
    // 🧹 Διαγραφή του προσωρινού αρχείου, ανεξαρτήτως επιτυχίας ή αποτυχίας
    if (fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  }
};
