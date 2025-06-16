const mongoose = require('mongoose');

const folderSchema = new mongoose.Schema({
    name: { type: String, required: true },
    desc: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

module.exports = mongoose.model('Folder', folderSchema);
