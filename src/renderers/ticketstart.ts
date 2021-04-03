import { MessageEmbed } from 'discord.js'

export class TicketStart extends MessageEmbed {
  constructor(msg: string) {
    super()
    this.setColor('GREYPLE')
    this.setTitle('New Ticket')
    this.setDescription(msg)
  }
}
