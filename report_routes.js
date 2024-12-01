const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report_controller');

router.use(reportController);

module.exports = router;
