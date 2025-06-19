const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema({
    folderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Folder' },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    pictureUrl: { type: String, required: true },
    publicId: { type: String, required: true },
    favorite: { type: Number, default: 0 }, 
}, { timestamps: true });

module.exports = mongoose.model('Picture', pictureSchema);
