const ingredientService = require('./ingredients.service');
const logger = require('../../_config/logger');
const createError = require('http-errors');


exports.createNewIngredient = (req, res, next) => {

    const { ingredient_name } = req.body;

    if (!ingredient_name) {

        logger.error(`${new Date().toUTCString()}: ${req.method} Request to path:${req.path}, invalid request body :${JSON.stringify(req.body)}; missing fields`);
        return next(new createError.BadRequest('Invalid request body; missing fields'));
    }

    const newIngredient = { ingredientName: ingredient_name }

    return ingredientService.create(newIngredient)
        .then(ingredientData => {
            res.status(201).json(ingredientData);
        })
        .catch(err => {
            logger.error(err);
            return next(new createError[500]('Could not saved ingredient'));
        })
}

exports.getAllIngredients = (req, res, next) => {

    return ingredientService.findAll().then(ingredientList => {

        logger.info(`Send all of Ingredients list with length:${ingredientList.length}`);

        res.json(ingredientList);

    })

        .catch(err => {

            logger.error(err);

            return next(new createError[500]('Could not send ingredientList'));

        })
}

exports.getIngredientById = (req, res, next) => {

    const id = req.params.id;

    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id:${id}`);

    return ingredientService.findById(id)

        .then(ingredient => {

            if (!ingredient) {
                return next(new createError[500](`Could not send ingredient by id:${id}`));
            }

            res.json(ingredient)

        })

        .catch(err => {

            logger.error(err);

            if (err.kind === 'ObjectId') {
                return next(new createError.BadRequest(`Invalid ingredient ID: ${id}`));
            } else {
                return next(new createError.InternalServerError(err.message));
            }

        })
}

