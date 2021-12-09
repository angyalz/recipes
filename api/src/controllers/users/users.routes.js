const express = require('express');
const routes = express.Router();
const userController = require('./users.controller');


const authenticationByJWT = require('../../auth/authenticate');
const adminRoleHandler = require('../../auth/adminOnly');


routes.get('/', authenticationByJWT,  (req, res, next) => {
    return userController.getAllUsers(req, res, next);
});

routes.get('/:id', authenticationByJWT, (req, res, next) => {
    return userController.getUserById(req, res, next);
});

routes.post('/', (req, res, next) => {
    return userController.createNewUser(req, res, next);
});


module.exports = routes;