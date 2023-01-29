module.exports = (command) => {
    const { commandObject, commandName } = command
    const { deferReply } = commandObject

        if (deferReply && typeof deferReply !== 'boolean' && deferReply !== 'ephemeral') {
            throw new Error(`Command "${commandName}" does not have a valid value for "deferReply". Please use true/false or "ephemeral".`)
        }
}