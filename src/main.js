if (Number(process.version.slice(1).split('.')[0]) < 12) throw new Error('Node 12.0.0 or newer is required. Update Node on your system.');

const { Client, Collection } = require('discord.js');
const { readdir } = require('fs').promises;
const { join } = require('path');

/**
 * @typedef {Object} ReactionRole
 * @prop {Map<string, string>} commands
 * @prop {Map<string, string>} aliases
 * @prop {import("./config.js").Handlers} config The config file
 * @prop {import("./utils/index.js").Utils} utils Some util methods and classes
 */

/**
 * @class ReactionRole
 * @extends {Client}
 */
class ReactionRole extends Client {
	constructor() {
		super();
		/** @type {Map<string, string>} */
		this.commands = new Collection(undefined);
		/** @type {Map<string, string>} */
		this.aliases = new Collection(undefined);

		/** @type {import("./config.js")} */
		this.config = require('./config');
		/** @type {import("./utils").Utils} */
		this.utils = require('./utils');

		this._run()
	}

	/**
	 * @description Connects the Client to a Websocket
	 * @private
	 * @returns {void}
	 */
	_run() {
		this._commandsLoader();
		this._eventsLoader();

		this.login(this.config.bot.token).then(() => this.utils.Logger.log('WebSocket Connected'));
	}

	/**
	 * @description Load all categories and commands modules
	 * @private
	 * @returns {void}
	 */
	async _commandsLoader() {
		let commandsLength = 0;
		const commands = await readdir(join(__dirname, '/modules/commands'));
		commandsLength = commandsLength + commands.length;
		commands.forEach((cmd) => {
			try {
				const command = new (require(join(__dirname, '/modules/commands', cmd)))(this);

				this.commands.set(command.help.name, command);
				command.conf.aliases.forEach((alias) => {
					this.aliases.set(alias, command.help.name);
				});
			} catch (error) {
				return this.utils.Logger.error(`[Commands] Failed to load command ${cmd}: ${error || error.stack}`);
			}
		});
		return this.utils.Logger.log(`[Commands] - Loaded ${this.commands.size}/${commandsLength} commands.`);
	}

	/**
	 * @description Load all events modules
	 * @private
	 * @returns {void}
	 */
	async _eventsLoader() {
		let eventLoadedLength = 0;
		const events = await readdir(join(__dirname, '/modules/events'));
		events.forEach((file) => {
			try {
				eventLoadedLength++;
				const fileName = file.split('.')[0];
				const event = new (require(join(__dirname, '/modules/events', file)))(this);
				this.on(fileName, (...args) => event.run(...args));
				delete require.cache[require.resolve(join(__dirname, '/modules/events', file))];
			} catch (error) {
				return this.utils.Logger.error(`[Events] - Failed to load event ${file}: ${error}`);
			}
		});

		this.utils.Logger.log(`[Events] - Loaded ${eventLoadedLength}/${events.length} events.`);

		process.on('uncaughtException', (error) => this.utils.Logger.error(error.stack));

		process.on('unhandledRejection', (error) => this.utils.Logger.error(error.stack));
	}
}

module.exports = new ReactionRole();
