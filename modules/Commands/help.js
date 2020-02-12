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
        value: context.client.commands.filter((filters) => filters.help.category === 'General').map((name) => name.help.name).map(name => `\`${name}\``).join(', ')
      });

      context. message.channel.send({
        embed: {
          author: {
            name: `${context.client.user.username}'s commands list`,
            icon_url: context.client.user.displayAvatarURL
          },
          color: 0x6864ff,
          description: `Use \`${context.client.config.bot.prefix}help <command>\` for details. | ${context.client.commands.size} commands.`,
          footer: {
            text: context.client.user.username,
            icon_url: context.client.user.displayAvatarURL
          },
          fields: fields
        }
      });
    } else {
      let command = context.message.args[0];
      if (context.client.commands.has(command)) {
        command = context.client.commands.get(command);

        context.message.channel.send({
          embed: {
            author: {
              name: `Command: ${command.help.name}`,
              icon_url: context.client.user.displayAvatarURL
            },
            color: 0x6864ff,
            description: `__\`Description:\`__ ${command.help.description}\n  \n__\`Usage:\`__ ${command.help.usage}\n  \n__\`Alises:\`__ ${command.conf.aliases.join(', ')}`
          }
        });
      }
    }
  }
}

module.exports = Help;
