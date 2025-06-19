// orchestrator/routes/studentDashboard.js
const express = require('express');
const router = express.Router();
const axios = require('axios');
const jwt = require('jsonwebtoken');

const GRADES_SERVICE_URL = process.env.GRADES_SERVICE_URL;
const COURSE_SERVICE_URL = process.env.COURSE_SERVICE_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const extractUserIdFromToken = (req, res, next) => {
    console.log('📥 Headers received in request:', req.headers); // 👈 ΕΔΩ
  
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      console.error('❌ Missing or malformed Bearer token');
      return res.status(401).json({ error: 'Missing token' });
    }
  
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log('🔍 JWT decoded payload:', decoded);
      req.userId = decoded.sub;
      next();
    } catch (err) {
      console.error('❌ JWT decode error:', err.message);
      return res.status(403).json({ error: 'Invalid token' });
    }
  };

router.get('/student-dashboard', extractUserIdFromToken, async (req, res) => {
    const userId = req.userId;
    console.log('🧠 [orchestrator] Received request for student-dashboard');
    console.log('🔐 User ID from token:', userId);
  
    try {
      // 1. Get student grades
      const gradesRes = await axios.get(`${process.env.GRADES_SERVICE_URL}/grades/student/${userId}`, {
        headers: {
          Authorization: req.headers.authorization,  // 👈 Προώθησε το JWT token
        },
      });
      
      const grades = gradesRes.data;
      console.log('📦 Grades fetched:', grades.length);
  
      // 2. Extract course IDs
      const courseIds = [...new Set(grades.map(g => g.course_id))];
      console.log('📘 Course IDs:', courseIds);
  
      // 3. Fetch course titles
      const courseTitleMap = {};
      await Promise.all(
        courseIds.map(async (cid) => {
          try {
            const courseRes = await axios.get(`${COURSE_SERVICE_URL}/courses/${cid}`, {
              headers: {
                Authorization: req.headers.authorization, // προώθησε το αρχικό token
              },
            });
            courseTitleMap[cid] = courseRes.data.title;
          } catch (err) {
            console.warn(`⚠️ Failed to fetch course ${cid}:`, err.response?.status);
            courseTitleMap[cid] = 'Unknown';
          }
        })
      );
      
      // 4. Compose response
      const enrichedGrades = grades.map(g => ({
        course_id: g.course_id,
        course_title: courseTitleMap[g.course_id],
        grade: g.grade,
        type: g.type,
      }));
  
      res.json({ grades: enrichedGrades });
    } catch (err) {
      console.error('❌ Failed to build student dashboard:', err.message);
      if (err.response) {
        console.error('📄 Response status:', err.response.status);
        console.error('📄 Response data:', err.response.data);
      }
      res.status(500).json({ error: 'Internal error fetching dashboard' });
    }
  });
  

module.exports = router;
