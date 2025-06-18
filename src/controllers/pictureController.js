const Picture = require('../models/pictureModel');
const userModel = require('../models/userModel');
const mongoose = require('mongoose');
const cloudinary = require('../config/cloudinary');

const uploadImage = async (req, res) => {
    try {
        const files = req.files;
        const userId = req.user && req.user._id || req.user.id;
        const folderId = req.body.folderId;

        if (!files || files.length === 0) {
            return res.json({ status: 'error', message: 'Không có ảnh nào được upload!' });
        }

        console.log('req.files:', req.files);
        console.log('req.body:', req.body);

        const pictures = await Picture.insertMany(
            files.map(file => ({
                folderId: folderId || undefined,
                userId: userId,
                pictureUrl: file.path,
                publicId: file.filename,
            }))
        );

        res.json({
            status: 'success',
            message: 'Upload thành công!',
        });
    } catch (err) {
        res.json({ status: 400, message: 'Upload thất bại!', err });
    }
};

const getAllImageByUserAndFolder = async (req, res) => {
    try {
        const userId = req.user && (req.user._id || req.user.id);
        const folderId = req.params.folderId;

        const userObjectId = mongoose.Types.ObjectId(userId);
        const folderObjectId = mongoose.Types.ObjectId(folderId);

        const images = await Picture.find({
            userId: userObjectId,
            folderId: folderObjectId,
        }).sort({ createdAt: -1 });

        res.json({ status: 'success', data: images });
    } catch (err) {
        res.json({ status: 400, message: 'Lấy ảnh thất bại!', err });
    }
};

const getAllImageDetails = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id || req.user._id);
        if (!user || user.role !== 'admin') {
            return res.json({ status: 'error', message: 'Bạn không có quyền truy cập!' });
        }

        const images = await Picture.find()
            .populate({
                path: 'userId',
                select: 'name username'
            })
            .populate({
                path: 'folderId',
                select: 'name desc createdAt',
            })
            .sort({ createdAt: -1 });

        const data = images.map(img => ({
            imageId: img._id,
            publicId: img.publicId,
            name: img.userId?.name || '',
            username: img.userId?.username || '',
            pictureUrl: img.pictureUrl,

            folder: {
                folder_name: img.folderId?.name || '',
                desc: img.folderId?.desc || '',
                createdAt: img.folderId?.createdAt
                    ? new Date(img.folderId?.createdAt).toLocaleString('vi-VN', { hour12: false })
                    : ''
            }
        }));

        res.json({ status: 'success', data: data });
    } catch (err) {
        res.json({ status: 400, message: 'Lấy chi tiết ảnh thất bại!', err });
    }
};

const deleteImage = async (req, res) => {
    try {
        const imageId = req.body.imageId;
        const publicId = req.body.publicId;
        const user = await userModel.findById(req.user.id || req.user._id);

        let deleted;
        if (user && user.role === 'admin') {
            deleted = await Picture.findByIdAndDelete(imageId);
            await cloudinary.uploader.destroy(publicId)
        } else {
            deleted = await Picture.findOneAndDelete({
                _id: imageId,
                userId: req.user._id || req.user.id
            });
            await cloudinary.uploader.destroy(publicId)
        }

        if (!deleted) {
            return res.json({ status: 'error', message: 'Không tìm thấy hoặc không có quyền xóa ảnh này!' });
        }

        res.json({ status: 'success', message: 'Xóa ảnh thành công!' });
    } catch (err) {
        res.json({ status: 400, message: 'Xóa ảnh thất bại!', err });
    }
};

module.exports = {
    uploadImage,
    getAllImageByUserAndFolder,
    getAllImageDetails,
    deleteImage,
};
