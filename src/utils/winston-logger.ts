import * as winston from "winston";
const { combine, timestamp, label, printf } = winston.format;

export const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.label({ label: "LOGGER" }),
    winston.format.timestamp({}),
    winston.format.prettyPrint({ colorize: true }),
    winston.format.colorize({ all: true }),
    myFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.label({ label: "LOGGER" }),
        winston.format.timestamp(),
        winston.format.prettyPrint({ colorize: true }),
        winston.format.colorize({ all: true }),
        myFormat,
      ),
    }),
  ],
});
