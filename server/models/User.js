const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        // required: 'This fild is required. '
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    university: {
        type: String,
    },
    projects: {
        type: Array,
    }
});
userSchema.index({ name: 'text', description: 'text' });
module.exports = mongoose.model('User', userSchema);
