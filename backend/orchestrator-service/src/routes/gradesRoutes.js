const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const {
  getStudentGrades,
  getInstructorCourses,
  handleUpload
} = require('../controllers/gradesController');

router.get('/student/:studentId', getStudentGrades);
router.get('/instructor/:instructorId/courses', getInstructorCourses);
router.post('/:type', upload.single('file'), handleUpload);

module.exports = router;
