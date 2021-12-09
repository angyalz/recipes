const unitService = require('./units.service');
const logger = require('../../_config/logger');
const createError = require('http-errors');


exports.createNewUnit = (req, res, next) => {

    const { unit_name } = req.body;

    if (!unit_name) {

        logger.error(`${new Date().toUTCString()}: ${req.method} Request to path:${req.path}, invalid request body :${JSON.stringify(req.body)}; missing fields`);
        return next(new createError.BadRequest('Invalid request body; missing fields'));
    }

    const newUnit = { unitName: unit_name }

    return unitService.create(newUnit)
        .then(unitData => {
            res.status(201).json(unitData);
        })
        .catch(err => {
            logger.error(err);
            return next(new createError[500]('Could not saved unit'));
        })
}

exports.getAllUnits = (req, res, next) => {

    return unitService.findAll().then(unitList => {
        logger.info(`Send all of Units list with length:${unitList.length}`);
        res.json(unitList);
    })
        .catch(err => {
            logger.error(err);
            return next(new createError[500]('Could not send unitList'))
        })
}

exports.getUnitById = (req, res, next) => {

    const id = req.params.id;
    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id:${id}`);

    return unitService.findById(id)

        .then(unit => {

            if (!unit) {
                return next(new createError[500](`Could not send unit by id:${id}`));
            }

            res.json(unit)
            
        })

        .catch(err => {

            logger.error(err);

            if (err.kind === 'ObjectId') {
                return next(new createError.BadRequest(`Invalid ID: ${id}`));
            } else {
                return next(new createError[500](`Could not send unit by id:${req.params.id}`));
            }

        })
}