module.exports = class {
	constructor(client) {
		this.client = client;
	}

	run() {
		this.client.user.setPresence({
			activity: {
				name: `${this.client.config.bot.prefix}help`,
				type: 'PLAYING'
			},
			status: 'dnd'
		});

		this.client.utils.Logger.log(`[${this.client.user.username}] - ${this.client.users.cache.size} users in ${this.client.guilds.cache.size} servers.`);
	}
};
