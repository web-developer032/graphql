const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        required: [true, "Please provide your name."],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide your email."],
        lowercase: true,
        unique: true,
        trim: true,
    },
    phone: {
        type: String,
        unique: true,
        trim: true,
    },
});

const Client = mongoose.model("clients", clientSchema);
module.exports = Client;
