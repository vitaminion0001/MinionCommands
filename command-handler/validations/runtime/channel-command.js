module.exports = async (command, usage) => {
    const { commandName, instance } = command
    const { deferReply } = command.commandObject
    const { guild, channel, message, interaction } = usage

    if (!guild) {
        return true
    }

    const availableChannels = await instance.commandHandler.channelCommands.getAvailableChannels(guild.id, commandName)

    if (availableChannels.length && !availableChannels.includes(channel.id)) {
        const channelNames = availableChannels.map(c => `<#${c}> `)
        const reply = `You can only run this command inside of the following channels: ${channelNames}`

        if (deferReply) {
            if (message) message.send(reply)
            else if (interaction) interaction.editReply(reply)
            return false
        }
        if (message) message.send(reply)
        else if (interaction) interaction.reply(reply)

        return false
    }

    return true
}