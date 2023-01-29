module.exports = (command, usage) => {
    const { instance, commandObject } = command
    const { botOwners } = instance
    const { ownerOnly, deferReply } = commandObject
    const { user, guild, message, interaction } = usage

    if (ownerOnly === true && !botOwners.includes(user.id)) {
        const text = 'This command can only be ran by the bot owner.'

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