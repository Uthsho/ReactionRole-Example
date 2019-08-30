module.exports = class {
	constructor(client) {
		this.client = client;
	}

	run() {
		this.client.user.setPresence({
			game: {
				name: `${this.client.config.bot.prefix}help`,
				type: "PLAYING",
			},
			status: "dnd",
		});

		this.client.logger.log(`[${this.client.user.username}] - ${this.client.users.size} users in ${this.client.guilds.size} servers.`);
	}
};
