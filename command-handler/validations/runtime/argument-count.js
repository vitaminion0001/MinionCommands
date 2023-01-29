module.exports = (command, usage, prefix) => {
    const { minArgs = 0, maxArgs = -1, correctSyntax, expectedArgs = '', deferReply } = command.commandObject
    const { length } = usage.args

    if(length < minArgs || (length > maxArgs && maxArgs !== -1)) {
        const text = correctSyntax.replace('{PREFIX}', prefix).replace('{ARGS}', expectedArgs)

        const { message, interaction } = usage
 
        if (deferReply) {
            if (message) message.reply(text)
            else if (interaction) interaction.editReply(text)
            return false
        }
        if (message) message.reply(text)
        else if (interaction) interaction.reply(text)
        return false
    }

    return true
}