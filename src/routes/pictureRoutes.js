const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const pictureController = require('../controllers/pictureController');
const auth = require('../middleware/auth');

router.post('/upload', auth, upload.array('images', 50), pictureController.uploadImage);
// GET /get/:folderId?page=1&pageSize=30
router.get('/get/:folderId', auth, pictureController.getAllImageByUserAndFolder);
router.get('/all', auth, pictureController.getAllImageDetails);
router.get('/get', auth, pictureController.getAllImageByUser);
router.delete('/delete', auth, pictureController.deleteImage);

module.exports = router;
