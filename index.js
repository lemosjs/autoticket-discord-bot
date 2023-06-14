const { Client, IntentsBitField, Partials } = require("discord.js");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, ChannelType, PermissionsBitField } = require('discord.js')
const fs = require('fs')
const WOK = require("wokcommands");
const path = require("path");
const settingFile = fs.readFileSync('./settings.json')
const settings = JSON.parse(settingFile)
require("dotenv/config");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.MessageContent,
  ],
  partials: [Partials.Channel],
});

client.on("ready", () => {
  console.log('Bot is online!')
  new WOK({
    client,
    commandsDir: path.join(__dirname, "commands"),
  });
});

client.on('interactionCreate', async (interaction) => {
    if(interaction.isButton()){
        if(interaction.customId === "closeTicket"){

            //Check if member who clicked button has admin permissions

            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
                await interaction.reply({
                    content: 'You do not have permission to close this ticket',
                    ephemeral: true
                })
                return
            }
            else{
                await interaction.channel.delete()
            }
        }
    }
})

client.on('guildMemberAdd', async (member) => {
    //Create ticket channel for new member

    let channelName = `ticket-${member.user.username}`.toLowerCase()

    let everyoneRoleId = member.guild.roles.everyone.id

    //Create channel

    let channel = await member.guild.channels.create({
        name: channelName,
        type: ChannelType.GuildText,
        permissionOverwrites : [

            {
                id: member.id,
                allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            },
            {
                id: everyoneRoleId,
                deny: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
            }

        ]
    })

    //Create Embed

    let embed = new EmbedBuilder()
    .setTitle(settings.embedTitle)
    .setDescription(settings.embedDescription)
    .setColor(settings.embedColor)
    .setFooter({
        text: settings.embedFooterText,
        iconURL: settings.embedFooterIconURL
    })
    .setTimestamp()

    //Add close button 

    let closeButton = new ButtonBuilder()
    .setStyle(ButtonStyle.Danger)
    .setCustomId('closeTicket')
    .setLabel('Close Ticket')
    
    //Add action row

    let actionRow = new ActionRowBuilder()
    .addComponents(closeButton)

    //Send embed

    await channel.send({
        embeds: [embed],
        components: [actionRow]
    })
})

client.login(process.env.TOKEN);