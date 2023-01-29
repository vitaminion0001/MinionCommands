const customCommandSchema = require('../models/custom-command-schema')

class CustomCommands {
    // guildId-commandName: response
    _customCommands = new Map()

    constructor(commandHandler) {
        this._commandhandler = commandHandler
        this.loadCommands()
    }

    async loadCommands() {
        const results = await customCommandSchema.find({})

        for (const result of results) {
            const { _id, response } = result
            this._customCommands.set(_id, response)
        }

    }

    async create(guildId, commandName, description, response) {
        const _id = `${guildId}-${commandName}`

        this._customCommands.set(_id, response)

        this._commandhandler.slashCommands.create(commandName, description, [], guildId)

        await customCommandSchema.findByIdAndUpdate({
            _id
        }, {
           _id,
           response 
        }, {
            upsert: true
        })
    }

    async delete(guildId, commandName) {
        const _id = `${guildId}-${commandName}`

        this._customCommands.delete(_id)

        this._commandhandler.slashCommands.delete(commandName, guildId)

        await customCommandSchema.deleteOne({_id})
    }

    async run(commandName, message, interaction) {
        const guild = message ? message.guild : interaction.guild
        if (!guild) {
            return
        }

        const _id = `${guild.id}-${commandName}`
        const response = this._customCommands.get(_id)
        if (!response) {
            return
        }

        if (message) message.channel.send(response).catch(() => {})
        else if (interaction) interaction.reply(response).catch(() => {})

    }
}

module.exports = CustomCommands