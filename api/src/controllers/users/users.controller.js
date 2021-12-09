const userService = require('./users.service');
const logger = require('../../_config/logger');
const createError = require('http-errors');


exports.createNewUser = (req, res, next) => {

    const { username, password, email, role } = req.body;

    if (!username || !password || !email) {

        logger.error(`${new Date().toUTCString()}: ${req.method} Request to path:${req.path}, invalid request body :${JSON.stringify(req.body)}; missing fields`);
        return next(new createError.BadRequest('Invalid request body; missing fields'));
    }

    const newUser = {
        userName: username,
        password: password,
        email: email,
        role: role
    }

    return userService.create(newUser)
        .then(userData => {
            res.status(201).json(userData);
        })
        .catch(err => {
            logger.error(err);
            return next(new createError[500]('Could not saved user'));
        })
}

exports.getAllUsers = (req, res, next) => {

    return userService.findAll()
        .then(userList => {
            logger.info(`Send all of Users list with length:${userList.length}`);
            res.json(userList);
        })
        .catch(err => {
            logger.error(err);
            return next(new createError[500]('Could not send userList'))
        })
}

exports.getUserById = (req, res, next) => {

    const id = req.params.id;
    logger.debug(`${new Date().toUTCString()}:${req.method} Request, path: ${req.path} with id:${id}`);

    return userService.findById(id)

        .then(user => {

            if (!user) {
                return next(new createError[500](`Could not send user by id:${id}`));
            }

            res.json(user)

        })

        .catch(err => {

            logger.error(err);

            if (err.kind === 'ObjectId') {
                return next(new createError.BadRequest(`Invalid ID: ${id}`));
            } else {
                return next(new createError[500](`Could not send user by id:${req.params.id}`));
            }

        })
}
