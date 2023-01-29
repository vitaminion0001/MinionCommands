module.exports = (command, usage) => {
    const { guildOnly, deferReply } = command.commandObject
    const { guild, message, interaction } = usage

    if (guildOnly === true && !guild) {
        const text = 'This command can only be ran within a server.'

        if (deferReply) {
            if (message) message.send(text)
            else if (interaction) interaction.editReply(text)
            return false
        }
        if (message) message.send(text)
        else if (interaction) interaction.reply(text)
        return false
    }

    return true
}