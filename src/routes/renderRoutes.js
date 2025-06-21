const express = require('express');
const router = express.Router();
const renderController = require('../controllers/renderController');

router.patch('/env-vars', renderController.updateEnvVars);

module.exports = router;
