const Winston = require('winston');
const path = require('path');

const options = {
    file: {
        level: process.env.LOG_FILE || 'info',
        filename: path.join(__dirname, '..', '..', 'app.log'),
        format: Winston.format.json()
    },
    console: {
        level: 'debug', 
        format: Winston.format.combine(
            Winston.format.colorize(),
            Winston.format.simple()
        )
    }
};

const logger = Winston.createLogger({
    format: Winston.format.simple(),
    transports: [
        new Winston.transports.File(options.file),
        new Winston.transports.Console(options.console)
    ]
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message)
    }
}

module.exports = logger;