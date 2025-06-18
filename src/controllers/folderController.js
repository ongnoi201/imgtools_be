const Folder = require('../models/folderModel');
const Picture = require('../models/pictureModel');
const User = require('../models/userModel');


const addFolder = async (req, res) => {
    try {
        const { name, desc } = req.body;
        const userId = req.user && req.user._id || req.user.id;
        if (!name) return res.json({ status: 'error', message: 'Tên thư mục là bắt buộc' });

        const existed = await Folder.findOne({ name: name, userId: userId });
        if (existed) {
            return res.json({ status: 'error', message: 'Tên thư mục đã tồn tại' });
        }

        const folder = new Folder({ name, desc, userId});
        await folder.save();
        res.json({ status: 'success', data: folder, message: 'Tạo thư mục thành công' });
    } catch (error) {
        res.json({ status: 400, message: error.message });
    }
};

const editFolder = async (req, res) => {
    try {
        const { folderId, name, desc } = req.body;
        const userId = req.user && req.user._id;
        if (!folderId) return res.json({ status: 'error', message: 'Không xác định được thư mục' });

        if (name) {
            const existed = await Folder.findOne({ name: name, userId: userId, _id: { $ne: folderId } });
            if (existed) {
                return res.json({ status: 'error', message: 'Tên thư mục đã tồn tại' });
            }
        }

        const updateData = {};
        if (name) updateData.name = name;
        if (desc) updateData.desc = desc;
        const folder = await Folder.findOneAndUpdate({ _id: folderId, userId: userId }, updateData, { new: true });
        if (!folder) return res.json({ status: 'error', message: 'Không tìm thấy thư mục' });
        res.json({ status: 'success', data: folder, message: 'Cập nhật thư mục thành công' });
    } catch (error) {
        res.json({ status: 400, message: error.message });
    }
};

const deleteFolder = async (req, res) => {
    try {
        const { folderId } = req.body;
        const userId = req.user && req.user._id || req.user.id;
        const user = await User.findById(userId);
        if (!folderId) return res.json({ status: 'error', message: 'Không xác định được thư mục' });

        let folder;
        if (user && user.role === 'admin') {
            folder = await Folder.findById(folderId);
        } else {
            folder = await Folder.findOne({ _id: folderId, userId: userId });
        }

        if (!folder) return res.json({ status: 'error', message: 'Không tìm thấy thư mục hoặc không có quyền xóa' });

        await Picture.deleteMany({ folderId: folderId });
        await Folder.findByIdAndDelete(folderId);

        res.json({ status: 'success', message: 'Xóa thành công' });
    } catch (error) {
        res.json({ status: 400, message: error.message });
    }
};

const getAllFolder = async (req, res) => {
    try {
        const userId = req.user && (req.user._id || req.user.id);
        if (!userId) {
            return res.json({ status: 'error', message: 'Không xác định được người dùng' });
        }
        const user = await User.findById(userId);
        if (!user || user.role !== 'admin') {
            return res.json({ status: 'error', message: 'Bạn không có quyền truy cập!' });
        }
        const folders = await Folder.find().populate({ path: 'userId', select: 'name username avatar' });
        res.json({ status: 'success', data: folders });
    } catch (error) {
        res.json({ status: 400, message: error.message });
    }
};

const getAllFolderByUserId = async (req, res) => {
    try {
        const userId = req.user && (req.user._id || req.user.id);
        if (!userId) {
            return res.json({ status: 'error', message: 'Không xác định được người dùng' });
        }
        const folders = await Folder.find({ userId: userId });
        res.json({ status: 'success', data: folders });
    } catch (error) {
        res.json({ status: 400, message: error.message });
    }
};

module.exports = {
    addFolder,
    editFolder,
    deleteFolder,
    getAllFolder,
    getAllFolderByUserId,
};
