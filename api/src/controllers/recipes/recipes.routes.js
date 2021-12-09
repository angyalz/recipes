const express = require('express');
const routes = express.Router();
const recipeController = require('./recipes.controller');

const multer = require('multer');
const upload = multer({ dest: './public/images/' });


const authenticationByJWT = require('../../auth/authenticate');


routes.get('/', (req, res, next) => {
    return recipeController.getAllRecipes(req, res, next);
});

routes.get('/:id', (req, res, next) => {
    return recipeController.getRecipeById(req, res, next);
});

routes.post('/', upload.single('imageFile'), authenticationByJWT, (req, res, next) => {
    return recipeController.createNewRecipe(req, res, next);
});


module.exports = routes;