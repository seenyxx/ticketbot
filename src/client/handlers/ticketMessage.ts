import { Message, Webhook, WebhookClient } from 'discord.js'
import { TicketManager } from '../../database/tickets'
import { TicketBotClient } from '../client'
import { TicketMessage } from '../../renderers/ticketmsg'
import { cleanPings } from '../../lib/helpers';

export async function ticketMessage(client: TicketBotClient, msg: Message) {
  if (msg.partial) await msg.fetch()
  if (msg.author.bot) return
  if (msg.content.startsWith('~')) return

  const ticketDB = new TicketManager()

  if (msg.channel.type === 'dm') {
    const ticket = await ticketDB.getTicketByDM(msg.author.id)

    if (ticket === 'none') return

    const guild = await client.guilds.fetch(ticket.guild, true)

    const webhook =
      (await guild.fetchWebhooks()).find(wh => wh.id === ticket.value) || null

    if (!webhook) {
      return ticketDB.remTicket(msg.author.id, ticket.value)
    }

    webhook.send(cleanPings(msg.content))
  } else if (msg.channel.type === 'text') {
    const webhook = (await msg.channel.fetchWebhooks()).first()

    if (!webhook) return

    const ticket = await ticketDB.getTicketByChannel(webhook.id)

    if (ticket === 'none') return

    const user = await client.users.fetch(ticket.value, true)

    if (!user) {
      return ticketDB.remTicket(ticket.value, msg.channel.id)
    }

    const embed = new TicketMessage(cleanPings(msg.content))

    user.send(embed)
  }
}
