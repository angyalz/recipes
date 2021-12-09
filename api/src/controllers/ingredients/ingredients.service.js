const Ingredient = require('../../model/ingredient.model');

exports.create = (ingredient) => {
    const newIngredient = new Ingredient(ingredient);
    return newIngredient.save();
}

exports.findAll = () => Ingredient.find().collation({ locale: 'hu' }).sort({ ingredientName: 1 });

exports.findById = (id) => Ingredient.findById(id);
