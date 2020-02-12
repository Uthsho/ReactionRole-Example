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
    const client = this.client;
    if (!events.hasOwnProperty(event.t)) return;

    const { d: data } = event;
    const user = client.users.get(data.user_id);
    const channel = client.channels.get(data.channel_id);

    const message = await channel.fetchMessage(data.message_id);
    const member = message.guild.members.get(user.id);

    const emojiKey = (data.emoji.id) ? `${data.emoji.name}:${data.emoji.id}` : data.emoji.name;
    let reaction = message.reactions.get(emojiKey);

    if (!reaction) {
      const emoji = new Emoji(client.guilds.get(data.guild_id), data.emoji);
      reaction = new MessageReaction(message, emoji, 1, member.id === client.user.id);
    }

    if (member.id !== client.user.id) {
      if (event.t === 'MESSAGE_REACTION_ADD') {
        // Man emoji
        if ((reaction.emoji.name === '👨') || (reaction.emoji.toString() === '👨') || (reaction.emoji.id === '👨')) {
          const role = message.guild.roles.find((role) => role.name === 'Man');
          member.addRole(role.id).catch((error) => client.logger.error(error));
        }
        // Woman emoji
        if ((reaction.emoji.name === '👩') || (reaction.emoji.toString() === '👩') || (reaction.emoji.id === '👩')) {
          const role = message.guild.roles.find((role) => role.name === 'Woman');
          member.addRole(role.id).catch((error) => client.logger.error(error));
        }
      }
      if (event.t === 'MESSAGE_REACTION_REMOVE') {
        // Man emoji
        if ((reaction.emoji.name === '👨') || (reaction.emoji.toString() === '👨') || (reaction.emoji.id === '👨')) {
          const role = message.guild.roles.find((role) => role.name === 'Man');
          member.removeRole(role.id).catch((error) => client.logger.error(error));
        }
        // Woman emoji
        if ((reaction.emoji.name === '👩') || (reaction.emoji.toString() === '👩') || (reaction.emoji.id === '👩')) {
          const role = message.guild.roles.find((role) => role.name === 'Woman');
          member.removeRole(role.id).catch((error) => client.logger.error(error));
        }
      }
    }
  }
};
