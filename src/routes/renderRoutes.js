const express = require('express');
const router = express.Router();
const renderController = require('../controllers/renderController');

router.patch('/env-vars', renderController.updateEnvVars);
router.get('/get', renderController.getAllEnv);
router.delete('/delete', renderController.deleteEnv);

module.exports = router;
