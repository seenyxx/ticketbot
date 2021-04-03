import { createCommand } from '../client/command'
import { Message } from 'discord.js'
import { TicketManager } from '../database/tickets'
import { ErrorMessage } from '../renderers/error'
import { TicketClose } from '../renderers/ticketclose'
import { sleep } from '../client/client'

export default createCommand(
  {
    triggers: ['close', 'stop'],
    cooldown: 10,
    guildOnly: true,
    userPerms: ['MANAGE_CHANNELS'],
  },
  async (msg: Message, args: string[]) => {
    if (msg.channel.type !== 'text') return

    const ticketDB = new TicketManager(msg.guild?.id)
    const webhook = (await msg.channel.fetchWebhooks()).first() || null

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

    if (!member) {
      ticketDB.remTicket(ticket.value, webhook.id)
      msg.channel.send(new TicketClose(msg.author))

      await sleep(10 * 1000)
      msg.channel.delete('Ticket closed.')
    } else {
      const embed = new TicketClose(msg.author)

      ticketDB.remTicket(ticket.value, webhook.id)

      msg.channel.send(embed)
      member.createDM().then(dm => dm.send(embed))

      await sleep(10 * 1000)
      msg.channel.delete('Ticket closed.')
    }
  }
)
