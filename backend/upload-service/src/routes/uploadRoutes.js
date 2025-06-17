const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const controller = require('../controllers/uploadController');
const authorize = require('../middleware/authorize');

router.post('/:type', upload.single('file'), controller.handleUpload);

module.exports = router;
