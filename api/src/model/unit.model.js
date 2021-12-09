const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const UnitSchema = mongoose.Schema({

    unitName: { type: String, required: true, unique: true },

}, {

    timestamps: true

})

UnitSchema.plugin(idValidator);

module.exports = mongoose.model('Unit', UnitSchema, 'units');