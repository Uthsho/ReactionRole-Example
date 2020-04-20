const Command = require('../../structure/Command');

class Help extends Command {
	constructor(client) {
		super(client, {
			name: 'help',
			description: 'Displays all the available commands.',
			usage: 'help [command]',
			category: 'General',
			guildOnly: false
		});
	}

	run(context) {
		if (!context.message.args[0]) {
			const fields = [];

			fields.push({
				name: 'General',
				value: this.client.commands.filter((filters) => filters.help.category === 'General').map((command) => command.help.name).map((name) => `\`${name}\``).join(', ')
			});

			context.message.channel.send({
				embed: {
					author: {
						name: `${this.client.user.username}'s commands list`,
						icon_url: this.client.user.displayAvatarURL()
					},
					color: 6841599,
					description: `Use \`${this.client.config.bot.prefix}help <command>\` for details. | ${this.client.commands.size} commands.`,
					footer: {
						text: this.client.user.username,
						icon_url: this.client.user.displayAvatarURL()
					},
					fields: fields
				}
			});
		} else {
			let command = context.message.args[0];
			if (this.client.commands.has(command)) {
				command = this.client.commands.get(command);

				context.message.channel.send({
					embed: {
						author: {
							name: `Command: ${command.help.name}`,
							icon_url: this.client.user.displayAvatarURL()
						},
						color: 0x6864ff,
						description: `__\`Description:\`__ ${command.help.description}\n  \n__\`Usage:\`__ ${command.help.usage}\n  \n__\`Aliases:\`__ ${command.conf.aliases.join(', ')}`
					}
				});
			}
		}
	}
}

module.exports = Help;
