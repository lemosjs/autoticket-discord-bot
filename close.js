const { CommandType } = require("wokcommands");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  // Required for slash commands
  description: "Close ticket command",
  
  // Create a legacy and slash command
  type: CommandType.SLASH,


  // Invoked when a user runs the ping command
  callback: async ({interaction, member, channel}) => {

    //Check if channel name starts with ticket

    if(!channel.name.startsWith('ticket-')){
        await interaction.reply({
            content: 'This is not a ticket channel',
        })

        return
    }

    //Check if member who clicked button has admin permissions

    if(!member.permissions.has(PermissionsBitField.Flags.Administrator)){
        await interaction.reply({
            content: 'You do not have permission to close this ticket',
        });

        return;
    }

    else{
        await channel.delete()
    }

    
  },
}