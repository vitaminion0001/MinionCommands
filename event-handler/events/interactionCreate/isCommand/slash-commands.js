const { InteractionType } = require('discord.js')

module.exports = async (interaction, instance) => {
  const { commandHandler } = instance
  const { commands, customCommands } = commandHandler


  if (interaction.type !== InteractionType.ApplicationCommand) {
    return
  }

  const args = interaction.options.data.map(({ value }) => {
    return String(value)
  })

  const command = commands.get(interaction.commandName)
  if (!command) {
    customCommands.run(interaction.commandName, null, interaction)
    return
  }

  const { deferReply } = command.commandObject

  if (deferReply) {
    await interaction.deferReply({
      ephemeral: deferReply === 'ephemeral',
    })
  }

  const response = await commandHandler.runCommand(
    command,
    args,
    null,
    interaction
  )
  if (!response) {
    return
  }

  if (deferReply) {
    interaction.editReply(response).catch(() => {})
  } else {
    interaction.reply(response).catch(() => {})
  }
}
