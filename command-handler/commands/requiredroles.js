const { PermissionFlagsBits, ApplicationCommandOptionType } = require('discord.js')
const requiredRoles = require('../../models/required-roles-schema')


module.exports = {
    description: 'Sets what commands require what roles.',

    type: 'SLASH',
    testOnly: true,
    guildOnly: true,

    permissions: [PermissionFlagsBits.Administrator],

    options: [
        {
            name: 'command',
            description: 'The command to set roles for.',
            type: ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true
        },
        {
            name: 'role',
            description: 'The role to set for the command.',
            type: ApplicationCommandOptionType.Role,
            required: false,
        },
    ],

    autocomplete: (_, command) => {
        return [...command.instance.commandHandler.commands.keys()]
    },

    callback: async ({ instance, guild, args }) => {
        const [commandName, role] = args

        const command = instance.commandHandler.commands.get(commandName)
        if (!command) {
            return `The command "${commandName}" does not exist.`
        }

        const _id = `${guild.id}-${command.commandName}`

        if (!role) {
            const document = await requiredRoles.findById(_id)

            const roles = document && document.roles?.length ? document.roles.map((roleId) => `<@&${roleId}>`) : 'None.'

            return {
                content: `Here are the roles for "${commandName}": ${roles}`,
                allowedMentions: {
                    roles: []
                }
            }
        }

        const alreadyExists = await requiredRoles.findOne({
            _id,
            role: {
                $in: [role]
            }
        })

        if (alreadyExists) {
            const newData = await requiredRoles.findOneAndUpdate({
                    _id,
                },
                {
                    _id,
                    $pull: {
                    roles: role,
                },
                }
            )

            if (!newData.roles.length) {
                await requiredRoles.deleteOne({ _id })
            }

            return {
                content: `The command "${commandName}" no longer requires the role <@&${role}>.`,
                allowedMentions: {
                    roles: []
                }
            }
        }

        await requiredRoles.findOneAndUpdate({
            _id,
        },{
            _id,
            $addToSet: {
                roles: role,
            }
        },{
            upsert: true,
        })

        return {
            content: `The command "${commandName}" now requires the role <@&${role}>`,
            allowedMentions: {
                roles: []
            }
        }
    }
}