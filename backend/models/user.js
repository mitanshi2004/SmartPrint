const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    phoneNo: {
    type: String,
    required: true,
    match: /^[0-9]{10}$/, //ensures only 10-digit numbers
    unique: true           //number must be unique
}

});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
