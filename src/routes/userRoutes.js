const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

const router = express.Router();


router.get('/user/:id', auth, userController.getUser);
router.post('/add', userController.addUser);
router.post('/login', userController.login);
router.post('/logout', auth, userController.logout);
router.put('/edit', auth, userController.editUser);
router.delete('/delete', auth, userController.deleteSelf);
router.delete('/admin-delete', auth, userController.adminDeleteUser);
router.get('/all', auth, userController.getAllUser);

module.exports = router;