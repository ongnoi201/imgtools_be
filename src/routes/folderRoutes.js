const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const auth = require('../middleware/auth');

router.post('/add', auth, folderController.addFolder);
router.put('/edit', auth, folderController.editFolder);
router.delete('/delete', auth, folderController.deleteFolder);
router.get('/all', auth, folderController.getAllFolderByUserId);
router.get('/all-admin', auth, folderController.getAllFolder);

module.exports = router;
