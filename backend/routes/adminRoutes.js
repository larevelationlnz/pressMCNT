const express = require('express');
const router  = express.Router();
const { getStats } = require('../controllers/adminController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/stats', auth, adminOnly, getStats);  // GET /api/admin/stats

module.exports = router;
