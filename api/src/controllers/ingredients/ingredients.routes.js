const express = require('express');
const routes = express.Router();
const ingredientController = require('./ingredients.controller');


routes.get('/', (req, res, next) => {
    return ingredientController.getAllIngredients(req, res, next);
});


module.exports = routes;