const recipeService = require('./recipes.service');
const ingredientService = require('../ingredients/ingredients.service');
const unitService = require('../units/units.service');
const logger = require('../../_config/logger');
const createError = require('http-errors');


exports.createNewRecipe = async (req, res, next) => {

    const { title, subtitle, ingredients, methods, imageFile, userId } = JSON.parse(req.body.recipe);

    console.log('/recipe req.body at controller: ', req.body);

    if (!title || !ingredients || !methods || !imageFile || !userId) {

        logger.error(`${new Date().toUTCString()}: ${req.method} Request to path:${req.path}, invalid request body :${JSON.stringify(req.body)}; missing fields`);
        return next(new createError.BadRequest('Invalid request body; missing fields'));

    }

    try {

        const existingIngredientObjList = await ingredientService.findAll()
        const existingUnitObjList = await unitService.findAll()

        const existIngrList = existingIngredientObjList.map(ings => ings.ingredientName);
        const existUnitList = existingUnitObjList.map(units => units.unitName);

        for (const elem of ingredients) {

            let isExistIngs = existIngrList.includes(elem.ingredient);
            let isExistUnits = existUnitList.includes(elem.unit);

            if (isExistIngs) {
                elem.ingredient = existingIngredientObjList[existIngrList.indexOf(elem.ingredient)]._id;
            } else {
                let newIngredient = { ingredientName: elem.ingredient };
                const savedIngredient = await ingredientService.create(newIngredient);
                existIngrList.push(elem.ingredient);
                elem.ingredient = savedIngredient._id;

            };

            if (isExistUnits) {
                elem.unit = existingUnitObjList[existUnitList.indexOf(elem.unit)]._id;
            } else {
                let newUnit = { unitName: elem.unit };
                const savedUnit = await unitService.create(newUnit);
                existUnitList.push(elem.unit);
                elem.unit = savedUnit._id;
            }

        };

        const newRecipe = {
            title: title,
            subtitle: subtitle,
            ingredients: ingredients,
            methods: methods,
            imageSource: req.file.filename,
            user_id: userId
        }

        const savedRecipe = await recipeService.create(newRecipe);
        res.status(201).json(savedRecipe);

    } catch (err) {
        logger.error(err);
        return next(new createError[500](err.message));
    }
}

exports.getAllRecipes = (req, res, next) => {

    console.log(req.query);     // debug

    return recipeService.findAll(req.query)

        .then(recipeList => {
            logger.info(`Send all of Recipes list with length:${recipeList.length}`);
            res.json(recipeList);
        })
        .catch(err => {
            logger.error(err);
            return next(new createError[500]('Could not send recipeList'))
        })
}

exports.getRecipeById = (req, res, next) => {

    const id = req.params.id;
    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id:${id}`)

    return recipeService.findById(id)

        .then(recipe => {

            if (!recipe) {
                return next(new createError[500](`Could not send recipe by id:${id}`));
            }

            res.json(recipe)
        })

        .catch(err => {

            logger.error(err);

            if (err.kind === 'ObjectId') {
                return next(new createError.BadRequest(`Invalid ID: ${id}`));
            } else {
                return next(new createError[500](`Could not send recipe by id:${req.params.id}`));
            }

        })
}

