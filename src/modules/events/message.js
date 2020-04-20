module.exports = class {
	constructor(client) {
		this.client = client;
	}

	run(message) {
		if (message.author.bot) return;

		if (!message.content.toLowerCase().startsWith(this.client.config.bot.prefix)) return;

		message.args = message.content.slice(this.client.config.bot.prefix.length).trim().split(/ +/g);
		const command = message.args.shift().toLowerCase();

		const cmd = this.client.commands.get(command) || client.commands.get(this.client.aliases.get(command));

		if (!cmd) return;

		if (cmd && !message.guild && cmd.conf.guildOnly) {
			return message.channel.send('This command is unavailable via private message. Please run this command in a guild.');
		}

		cmd.run({ client: this.client, message });
	}
};
