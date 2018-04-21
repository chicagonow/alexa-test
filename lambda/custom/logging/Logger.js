const winston = require('winston');

const logger = winston.createLogger({
    transports: [
        // colorize the output to the console
        new winston.transports.Console({colorize: true})
    ]

});

module.exports = logger;
