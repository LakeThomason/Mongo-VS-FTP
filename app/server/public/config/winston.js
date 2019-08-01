var appRoot = require("app-root-path");
var winston = require("winston");
var { format } = require("logform");
const { combine, timestamp, printf } = format;

// Options object that sets basic configuration for custom logger
var options = {
  file: {
    level: "info",
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: false
  },
  console: {
    level: "debug",
    handleExceptions: true,
    json: false,
    colorize: true
  }
};

// Provide a format to easily read logs
const simpleFormat = printf(info => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

// Customize our logger
var logger = winston.createLogger({
  transports: [
    new winston.transports.File(options.file),
    new winston.transports.Console(options.console)
  ],
  format: combine(timestamp(), simpleFormat),
  exitOnError: false // do not exit on handled exceptions
});

// Stream object for morgan package to track http requests
logger.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};

module.exports = logger;
