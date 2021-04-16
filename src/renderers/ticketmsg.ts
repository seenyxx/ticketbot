import { MessageEmbed, User } from 'discord.js'

export class TicketMessage extends MessageEmbed {
  constructor(message: string) {
    super()
    this.setColor('BLURPLE')
    this.setAuthor('Moderator Response')
    this.setTitle('Message')
    this.setDescription(message)
    this.setTimestamp(Date.now())
  }
}
