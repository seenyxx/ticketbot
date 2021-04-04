import { Message, TextChannel, MessageEmbed } from 'discord.js'
import { createCommand } from '../client/command'
import { TicketSetup } from '../renderers/ticketsetup'
import { sleep } from '../client/client'
import { TICKET_REACTION } from '../lib/constants'
import { Guild } from '../database/guild'

export default createCommand(
  {
    triggers: ['setup', 'start'],
    cooldown: 30,
    guildOnly: true,
    userPerms: ['MANAGE_GUILD', 'MANAGE_CHANNELS', 'MANAGE_MESSAGES'],
  },
  async (msg: Message, args: string[]) => {
    if (!msg.guild) return

    const guildDB = new Guild(msg.guild.id)

    msg.channel.send(
      `This is a setup for a ticket system in your server.\n**The following actions will be called...**\n\`Create new category as a category for all incoming tickets\`\n\`Crete a new message that everyone can react to and be prompted for the create of a ticket\``
    )

    await sleep(1.5 * 1000)

    await msg.channel.send(
      'Mention a channel within `10` seconds where the ticket system will be avaliable to everyone!'
    )

    const awaitedChannel = await msg.channel.awaitMessages(
      (m: Message) => m.author.id === msg.author.id,
      {
        time: 10000,
        max: 1,
      }
    )

    const channel = awaitedChannel
      .first()
      ?.mentions.channels.first() as TextChannel

    if (!channel) return

    const embed = new TicketSetup()

    const setupMessage = await channel.send(embed)

    setupMessage.react(TICKET_REACTION)

    await guildDB.setReactionPrompt(setupMessage)

    const cat = await msg.guild.channels.create(`${TICKET_REACTION} Tickets`, {
      type: 'category',
    })

    await guildDB.setCategory(cat)
  }
)
