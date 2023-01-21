let mongoose = require("mongoose");

let userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            require: true,
            unique: true
        },

        password: {
            type: String,
            minlength: 8,
            require: true
        },

        phone: {
            type: String,
            unique: true,
            required: true,
        },

        isDeleted: { type: Boolean, default: false },

    }, { timestamps: true })

module.exports = mongoose.model("User", userSchema);