import { MessageEmbed, User } from 'discord.js'

export class LogTicketClose extends MessageEmbed {
  constructor(user: User, reason: string, name: string) {
    super()
    this.setColor('RED')
    this.setTitle(`Closed Ticket - ${name}`)
    this.setDescription(`Closed by <@${user.id}>`)
    this.addField('Reason', reason)
    this.setTimestamp(Date.now())
  }
}
