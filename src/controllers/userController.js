const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

class UserController {
    async getUser(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.json({ status: 'error', message: 'Không tìm thấy người dùng' });
            }
            res.json({ status: 'success', data: user });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async addUser(req, res) {
        try {
            const { name, username, password, avatar } = req.body;
            const usernameRegex = /^[A-Za-z0-9]{1,20}$/;
            if (!usernameRegex.test(username)) {
                return res.json({ status: 'error', message: 'Chỉ cho phép chữ cái, số và tối đa 20 ký tự.' });
            }
            if (typeof password !== 'string' || password.length < 8) {
                return res.json({ status: 'error', message: 'Mật khẩu phải có ít nhất 8 ký tự.' });
            }

            const existingUser = await User.findOne({ username });
            if (existingUser) {
                return res.json({ status: 'error', message: 'Tên người dùng đã tồn tại' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new User({ name, username, password: hashedPassword, avatar });
            await user.save();
            res.json({ status: 'success', message: 'Đăng ký thành công' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async editUser(req, res) {
        try {
            const currentUserId = req.user.id;
            const currentUser = await User.findById(currentUserId);
            if (!currentUser) {
                return res.json({ status: 'error', message: 'Không tìm thấy người dùng hiện tại' });
            }

            let targetUserId = currentUserId;
            if (currentUser.role === 'admin' && req.body.userId) {
                targetUserId = req.body.userId;
            }

            const updateData = {};

            if (Object.prototype.hasOwnProperty.call(req.body, 'name')) {
                updateData.name = req.body.name;
            }

            if (Object.prototype.hasOwnProperty.call(req.body, 'username')) {
                const newUsername = req.body.username;
                const usernameRegex = /^[A-Za-z0-9]{1,20}$/;
                if (!usernameRegex.test(newUsername)) {
                    return res.json({ status: 'error', message: 'Chỉ cho phép chữ cái, số và tối đa 20 ký tự.' });
                }
                const existingUser = await User.findOne({ username: newUsername, _id: { $ne: targetUserId } });
                if (existingUser) {
                    return res.json({ status: 'error', message: 'Tên người dùng đã tồn tại' });
                }
                updateData.username = newUsername;
            }
            if (Object.prototype.hasOwnProperty.call(req.body, 'avatar')) {
                updateData.avatar = req.body.avatar;
            }

            if (
                Object.prototype.hasOwnProperty.call(req.body, 'password') &&
                req.body.password !== undefined &&
                req.body.password !== null &&
                req.body.password !== ''
            ) {
                const password = req.body.password;
                if (typeof password !== 'string' || password.length < 8) {
                    return res.json({ status: 'error', message: 'Mật khẩu phải có ít nhất 8 ký tự.' });
                }
                updateData.password = await bcrypt.hash(password, 10);
            }

            if (Object.prototype.hasOwnProperty.call(req.body, 'role') && currentUser.role === 'admin') {
                updateData.role = req.body.role;
            }

            if (
                Object.prototype.hasOwnProperty.call(req.body, 'role') &&
                currentUser.role !== 'admin'
            ) {
                return res.json({ status: 'error', message: 'Bạn không có quyền cập nhật quyền hạn' });
            }

            if (Object.keys(updateData).length === 0) {
                return res.json({ status: 'error', message: 'Không có dữ liệu để cập nhật' });
            }

            const user = await User.findByIdAndUpdate(targetUserId, updateData, { new: true });
            if (!user) return res.json({ status: 'error', message: 'Không tìm thấy người dùng' });
            res.json({ status: 'success', data: user, message: 'Cập nhật thành công' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async deleteSelf(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.findById(userId);
            if (!user) {
                return res.json({ status: 'error', message: 'Không tìm thấy người dùng' });
            }
            if (user.role === 'admin') {
                return res.json({ status: 'error', message: 'Admin không thể tự xóa chính mình bằng quyền này' });
            }
            await User.findByIdAndDelete(userId);
            res.json({ status: 'success', message: 'Xóa thành công' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async adminDeleteUser(req, res) {
        try {
            const user = await User.findById(req.user.id);
            const userRole = user.role;
            const targetUserId = req.body.userId;

            if (userRole !== 'admin') {
                return res.json({ status: 'error', message: 'Bạn không có quyền truy cập' });
            }
            if (!targetUserId) {
                return res.json({ status: 'error', message: 'Thiếu userId cần xóa' });
            }
            if (targetUserId === user._id.toString()) {
                return res.json({ status: 'error', message: 'Không thể tự xóa chính mình bằng quyền admin' });
            }
            const targetUser = await User.findById(targetUserId);
            if (!targetUser) {
                return res.json({ status: 'error', message: 'Không tìm thấy người dùng' });
            }
            if (targetUser.role === 'admin') {
                return res.json({ status: 'error', message: 'Không thể xóa tài khoản admin khác' });
            }
            await User.findByIdAndDelete(targetUserId);
            res.json({ status: 'success', message: 'Xóa thành công' });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async login(req, res) {
        try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) return res.json({ status: 'error', message: 'Tên người dùng không đúng' });
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.json({ status: 'error', message: 'Mật khẩu không đúng' });
            const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '1d' });
            res.json({
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                    name: user.name,
                }
            });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }

    async logout(req, res) {
        res.json({ message: 'Đã đăng xuất' });
    }

    async getAllUser(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user || user.role !== 'admin') {
                return res.json({ status: 'error', message: 'Bạn không có quyền truy cập' });
            }
            const users = await User.find();
            res.json({ status: 'success', data: users });
        } catch (error) {
            res.json({ status: 400, message: error.message });
        }
    }
}

module.exports = new UserController();