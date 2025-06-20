const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const pictureController = require('../controllers/pictureController');
const auth = require('../middleware/auth');

router.post('/upload', auth, upload.array('images', 50), pictureController.uploadImage);
router.get('/get/:folderId', auth, pictureController.getAllImageByUserAndFolder);
router.get('/all', auth, pictureController.getAllImageDetails);
router.get('/get', auth, pictureController.getAllImageByUser);
router.delete('/delete', auth, pictureController.deleteImage);
router.patch('/favorite', auth, pictureController.updateFavoriteStatus);
router.get('/favorite', auth, pictureController.getFavoriteImagesByUser);
router.post('/image-user-folder', auth, pictureController.getImageUserFolder);

module.exports = router;
