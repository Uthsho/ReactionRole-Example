const { Emoji, MessageReaction } = require('discord.js');

const events = {
	MESSAGE_REACTION_ADD: 'messageReactionAdd',
	MESSAGE_REACTION_REMOVE: 'messageReactionRemove'
};

module.exports = class {
	constructor(client) {
		this.client = client;
	}

	async run(event) {
		if (!events.hasOwnProperty(event.t)) return;

		const { d: data } = event;
		const user = this.client.users.cache.get(data.user_id);
		const channel = this.client.channels.cache.get(data.channel_id);

		const message = await channel.messages.fetch(data.message_id);
		const member = message.guild.members.cache.get(user.id);

		const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
		let reaction = message.reactions.cache.get(emojiKey);

		if (!reaction) {
			const emoji = new Emoji(this.client, data.emoji);
			reaction = new MessageReaction(this.client, emoji, message);
		}

		if (member.id !== this.client.user.id) {
			if (event.t === 'MESSAGE_REACTION_ADD') {
				// Man emoji
				if ((reaction.emoji.name === '👨') || (reaction.emoji.toString() === '👨') || (reaction.emoji.id === '👨')) {
					const role = message.guild.roles.cache.find((role) => role.name === 'Man');
					member.roles.add(role, 'Reaction role').catch((error) => this.client.logger.error(error));
				}
				// Woman emoji
				if ((reaction.emoji.name === '👩') || (reaction.emoji.toString() === '👩') || (reaction.emoji.id === '👩')) {
					const role = message.guild.roles.cache.find((role) => role.name === 'Woman');
					member.roles.add(role, 'Reaction role').catch((error) => this.client.logger.error(error));
				}
			}
			if (event.t === 'MESSAGE_REACTION_REMOVE') {
				// Man emoji
				if ((reaction.emoji.name === '👨') || (reaction.emoji.toString() === '👨') || (reaction.emoji.id === '👨')) {
					const role = message.guild.roles.cache.find((role) => role.name === 'Man');
					member.roles.remove(role, 'Reaction role').catch((error) => this.client.logger.error(error));
				}
				// Woman emoji
				if ((reaction.emoji.name === '👩') || (reaction.emoji.toString() === '👩') || (reaction.emoji.id === '👩')) {
					const role = message.guild.roles.cache.find((role) => role.name === 'Woman');
					member.roles.remove(role, 'Reaction Role').catch((error) => this.client.logger.error(error));
				}
			}
		}
	}
};
