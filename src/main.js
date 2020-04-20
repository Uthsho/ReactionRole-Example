if (Number(process.version.slice(1).split('.')[0]) < 12) throw new Error('Node 12.0.0 or newer is required. Update Node on your system.');

const { Client, Collection } = require('discord.js');
const { readdirSync } = require('fs');
const { join } = require('path');

/**
 * @class ReactionRole
 * @extends {Client}
 */
class ReactionRole extends Client {
	constructor() {
		super();

		this.config = require('./config');

		/** @type {import("./utils").Utils} */
		this.utils = require('./utils');
		this.run()
	}

	run() {
		this.commands = new Collection();
		this.aliases = new Collection();
		this._commandsLoader();
		this._eventsLoader();
		this.login(this.config.bot.token);
	}

	/**
   * @description Load all commands modules
   * @private
   */
	_commandsLoader() {
		let commandsLength = 0;
		const commands = readdirSync(join(__dirname, '/modules/commands'));
		commandsLength = commandsLength + commands.length;
		commands.forEach((cmd) => {
			try {
				const command = new (require(join(__dirname, '/modules/commands', cmd)))(this);

				this.commands.set(command.help.name, command);
				command.conf.aliases.forEach((alias) => {
					this.aliases.set(alias, command.help.name);
				});
			} catch (error) {
				return this.utils.Logger.error(`[Commands] Failed to load command ${cmd}: ${error}`);
			}
		});
		return this.utils.Logger.log(`[Commands] - Loaded ${this.commands.size}/${commandsLength} commands.`);
	}

	/**
   * @description Load all events modules
   * @private
   */
	_eventsLoader() {
		let eventLoadedLength = 0;
		const events = readdirSync(join(__dirname, '/modules/events'));
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
		return this.utils.Logger.log(`[Events] - Loaded ${eventLoadedLength}/${events.length} events.`);
	}
}

process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception: ', err);
	process.exit(1);
});

process.on('unhandledRejection', (err) => {
	console.error('Uncaught Promise Error: ', err);
});

module.exports.client = new ReactionRole();
