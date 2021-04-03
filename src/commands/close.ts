import { createCommand } from '../client/command'
import { Message } from 'discord.js'
import { TicketManager } from '../database/tickets'
import { ErrorMessage } from '../renderers/error'
import { TicketClose } from '../renderers/ticketclose'
import { sleep } from '../client/client'
import { Guild } from '../database/guild'
import { LogTicketClose } from '../renderers/closeticketlog'

export default createCommand(
  {
    triggers: ['close', 'stop'],
    cooldown: 10,
    guildOnly: true,
    userPerms: ['MANAGE_CHANNELS'],
  },
  async (msg: Message, args: string[]) => {
    if (msg.channel.type !== 'text' || !msg.guild) return

    const ticketDB = new TicketManager(msg.guild.id)
    const guildDB = new Guild(msg.guild.id)

    const webhook = (await msg.channel.fetchWebhooks()).first() || null
    const reason = args[0] || 'No reason provided'

    if (!webhook) {
      return msg.channel.send(
        new ErrorMessage('This channel is not a ticket channel.')
      )
    }

    const ticket = await ticketDB.getTicketByChannel(webhook.id)

    if (ticket === 'none') {
      return msg.channel.send(
        new ErrorMessage('This channel is not a ticket channel.')
      )
    }

    const member = msg.guild?.members.cache.find(
      member => member.id === ticket.value
    )

    if (member) {
      const embed = new TicketClose(msg.author, reason)
      member.createDM().then(dm => dm.send(embed))
    }

    ticketDB.remTicket(ticket.value, webhook.id)
    msg.channel.send(new TicketClose(msg.author, reason))

    const guildWh = await guildDB.logsWebhook()
    const actualWh = (await msg.guild.fetchWebhooks()).find(
      wh => wh.id == guildWh
    )

    if (actualWh) {
      const embed = new LogTicketClose(msg.author, reason, msg.channel.name)

      actualWh.send(embed)
    }

    await sleep(10 * 1000)
    msg.channel.delete('Ticket closed.')
  }
)
