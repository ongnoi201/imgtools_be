const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: false },
    username: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, required: true,default: 'user' },
    avatar: { type: String, default: 'https://png.pngtree.com/thumb_back/fh260/background/20230411/pngtree-natural-forest-animals-quiet-image_2256203.jpg'},
    avatar_frame: { type: String, default: 'https://png.pngtree.com/thumb_back/fh260/background/20230411/pngtree-natural-forest-animals-quiet-image_2256203.jpg'}
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
