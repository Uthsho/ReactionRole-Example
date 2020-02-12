const Command = require('../../structure/Command');

class Setup extends Command {
  constructor(client) {
    super(client, {
      name: 'setup',
      description: 'Launch the reaction role.',
      usage: 'setup',
      category: 'General',
      guildOnly: true
    });
  }

  run(context) {
    const configuration = context.client.config.setup.roles.map((role, emote) => {
      return {
        role: role,
        emoji: context.client.config.setup.emojis[emote]
      };
    });
    const embed = {
      embed: {
        author: {
          name: 'Reaction Role',
          icon_url: context.message.guild.iconURL
        },
        color: 8983806,
        fields: []
      }
    };
    for (const { role, emoji } of configuration) {
      if (!context.message.guild.roles.find((r) => r.name === role)) {
        context.message.channel.send(`The role \`${role}\` doesn't exist.`);
      }

      const guildEmoji = context.client.emojis.find((emote) => emote.name === emoji);

      if (!guildEmoji) embed.embed.fields.push({ name: role, value: `React to ${emoji} to get the \`${role}\` role.` });
      else embed.embed.fields.push({ name: role, value: `React to ${guildEmoji} to get the **"${role}"** role.` });
    }

    context.message.channel.send(embed).then(async (msg) => {
      for (const emoji of context.client.config.setup.emojis) {
        const guildEmoji = context.client.emojis.find((emote) => emote.name === emoji);

        if (!guildEmoji) await msg.react(emoji);
        else await msg.react(guildEmoji.id);
      }
    });
  }
}

module.exports = Setup;
