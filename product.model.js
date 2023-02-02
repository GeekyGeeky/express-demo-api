const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    quantity:{
        type: Number,
        default: 1
    },
    created_at: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Product', ProductSchema);

