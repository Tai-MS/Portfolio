import winston from 'winston';
import { constants } from '../utils.js';

const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'blue',
        http: 'cyan',
        debug: 'white'
    }
};

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug', 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error' 
        },
        winston.format.simple())
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info', 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error' 
        },
        winston.format.simple())
    ]
});

winston.addColors(customLevelOptions.colors);

const logger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console({
            level: 'info', 
            format: winston.format.combine(
                winston.format.colorize({ colors: customLevelOptions.colors }),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'warning'
        },
        winston.format.simple())
    ]
});

Object.keys(customLevelOptions.levels).forEach((level) => {
    logger[level] = function (message) {
        logger.log({ level: level, message: message });
    };
});

export const addLogger = (req, res, next, level) => {
    req.logger = constants.ENVIRONMENT === 'prod' ? prodLogger : devLogger;
    
    next();
};

export { devLogger, prodLogger };
