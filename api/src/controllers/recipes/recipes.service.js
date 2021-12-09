const Recipe = require('../../model/recipe.model');
const userService = require('../users/users.service');


exports.create = async (recipe) => {

    const newRecipe = new Recipe(recipe);

    try {
        const savedRecipe = await newRecipe.save();
        const user = await userService.findById(recipe.user_id)
        user.recipes.push(newRecipe._id);
        await user.save();
        return savedRecipe;
    } catch (err) {
        console.log(err);
    }
}

exports.findById = (id) => Recipe.findById(id)
    .populate('ingredients.ingredient', 'ingredientName')
    .populate('ingredients.unit', 'unitName');

exports.findByUserId = (userId) => Recipe.find({userId}).sort({ 'updatedAt': 'desc' })
    .populate('ingredients.ingredient', 'ingredientName')
    .populate('ingredients.unit', 'unitName');

exports.findAll = () => Recipe.find().sort({ 'updatedAt': 'desc' })
    .populate('ingredients.ingredient', 'ingredientName')
    .populate('ingredients.unit', 'unitName');

exports.update = (recipeId, updatedRecipe) => Recipe.findByIdAndUpdate(recipeId, updatedRecipe, { new: false });

exports.delete = (id) => Recipe.findByIdAndRemove(id);