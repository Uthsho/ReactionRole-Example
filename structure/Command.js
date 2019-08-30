class Command {
    constructor (client, {
        name = null,
        description = "No description provided",
        usage = "No usage provided",
        category = "Other",
        guildOnly = true,
        aliases = [],
    }) {
        this.client = client;
        this.help = { name, description, usage, category };
        this.conf = { guildOnly, aliases };
    }
}
module.exports = Command;
