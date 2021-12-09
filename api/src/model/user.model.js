const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const UserSchema = mongoose.Schema({

    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, match: /.+\@.+\..+/, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    recipes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }
    ]

}, {

    timestamps: true

})

UserSchema.plugin(idValidator);

module.exports = mongoose.model('User', UserSchema, 'users');