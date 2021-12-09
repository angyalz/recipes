require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const logger = require('./_config/logger');
const app = express();
const path = require('path');
const staticUrl = path.join(__dirname, '..', 'public', 'angular');

const swaggerUI = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/swagger.yaml')

app.use(morgan('combined', { stream: logger.stream }));
app.use(express.json());
app.use(cors());
app.options('*', cors());

const authHandler = require('./auth/authHandler');

app.use('/', (req, res, next) => {
    console.log(`HTTP ${req.method} ${req.path}`);
    next();
});

app.post('/login', authHandler.login);
app.post('/refresh', authHandler.refresh);
app.post('/logout', authHandler.logout);

app.use('/ingredients', require('./controllers/ingredients/ingredients.routes'));
app.use('/recipes', require('./controllers/recipes/recipes.routes'));
app.use('/units', require('./controllers/units/units.routes'));
app.use('/users', require('./controllers/users/users.routes'));
app.get('/images/:file', (req, res, next) => {
    logger.info(`file request: ${req.params.file}`);
    res.download(`./public/images/${req.params.file}`);
});

app.use('/api-doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.use('/', express.static(staticUrl));

app.all('*', (req, res) => {
    res.redirect('');
})

app.use((err, req, res, next) => {
    logger.error(`ERROR ${err.statusCode}: ${err.message}`);
    res.status(err.statusCode);
    res.json({
        hasError: true,
        message: err.message
    })
});

module.exports = app;