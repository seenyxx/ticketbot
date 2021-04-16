import { MessageEmbed } from 'discord.js'
import { TICKET_REACTION } from '../lib/constants'

export class TicketSetup extends MessageEmbed {
  constructor() {
    super()
    this.setColor(0x17c1ff)
    this.setTitle(`${TICKET_REACTION} Create a Ticket`)
    this.setDescription(
      `React with \`${TICKET_REACTION}\` to create a new ticket!`
    )
  }
}
