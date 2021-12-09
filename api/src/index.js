require('dotenv').config();
const config = require('config');
const PORT = config.get('port') || process.env.PORT || 3000;
const logger = require('./_config/logger');
const app = require('./server');

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);

if (!config.has('database')) {
    logger.error('Database config not found');
    process.exit();
};

const connectionString = `${config.get('database.dbType')}${config.get('database.username')}${config.get('database.password')}${config.get('database.host')}`;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    logger.info('Mongodb connection established')
}).catch((err) => {
    logger.error(err);
    process.exit();
});

app.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});