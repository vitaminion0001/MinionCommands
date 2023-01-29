module.exports = async (command, usage) => {
    const { commandName, instance } = command
    const { deferReply } = command.commandObject
    const { guild, message, interaction } = usage

    if (!guild) {
        return true
    }

    if (instance.commandHandler.disabledCommands.isDisabled(guild.id, commandName)) {
        const text = 'This command is disabled.'

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