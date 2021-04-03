import { MessageEmbed, User } from 'discord.js'

export class TicketMessage extends MessageEmbed {
  constructor(author: User, message: string) {
    super()
    this.setColor('BLURPLE')
    this.setAuthor(author.tag, author.displayAvatarURL())
    this.setTitle('Message')
    this.setDescription(message)
    this.setTimestamp(Date.now())
  }
}
