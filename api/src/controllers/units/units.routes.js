const express = require('express');
const routes = express.Router();
const unitController = require('./units.controller');


routes.get('/', (req, res, next) => {
    return unitController.getAllUnits(req, res, next);
});


module.exports = routes;