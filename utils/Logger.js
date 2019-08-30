const chalk = require("chalk");
const moment = require("moment");

class Logger {
	/**
     * Used to display some messages.
     * @function options.bot.logger.log
     * @param {string} message Message(s) to be shown in the log.
     * @returns {void}
     */
	static log(message) {
		return console.log(`[${chalk.keyword("green")(`${moment().format("HH:mm:ss")}`)}] - [${chalk.keyword("green")("LOG")}] ${message}`);
	}

	/**
     * Used to display warnings messages.
     * @function options.bot.logger.warn
     * @param {string} message Message(s) to be shown in the warn log.
     * @returns {void}
     */
	static warn(message) {
		return console.log(`[${chalk.keyword("orange")(`${moment().format("DD/MM HH:mm:ss")}`)}] - ${chalk.keyword("orange")("WARNING")}] ${message}`);
	}

	/**
     * Used to display errors messages.
     * @function options.bot.logger.error
     * @param {string} message Message(s) to be shown in the error log.
     * @returns {void}
     */
	static error(message) {
		return console.log(`[${chalk.keyword("red")(`${moment().format("DD/MM HH:mm:ss")}`)}] - ${chalk.keyword("red")("ERROR")}] ${message}`);
	}
}

module.exports = Logger;
