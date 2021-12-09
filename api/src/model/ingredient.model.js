const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const IngredientSchema = mongoose.Schema({

    ingredientName: { type: String, required: true, unique: true },

}, {

    timestamps: true

})

IngredientSchema.plugin(idValidator);

module.exports = mongoose.model('Ingredient', IngredientSchema, 'ingredients');