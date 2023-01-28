const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

UserSchema.methods.toMap = function () {
    const { id, name, email } = this;
    return {
        id,name, email
    };
}

module.exports = mongoose.model('User', UserSchema);

