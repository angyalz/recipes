const mongoose = require('mongoose');
const idValidator = require('mongoose-id-validator');

const RecipeSchema = mongoose.Schema({

    title: { type: String, required: true },
    subtitle: { type: String, required: false },
    ingredients: [
        {
            quantity: { type: Number, required: true },
            unit: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Unit' },
            ingredient: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Ingredient' }
        }
    ],
    methods: [
        {
            type: Array, required: true,
            method: { type: String, required: true }
        }
    ],
    imageSource: {type: String, required: true},
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {

    timestamps: true

})

RecipeSchema.plugin(idValidator);

module.exports = mongoose.model('Recipe', RecipeSchema, 'recipes');