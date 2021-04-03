import { MessageEmbed, User } from 'discord.js'

export class TicketClose extends MessageEmbed {
  constructor(user: User, reason: string) {
    super()
    this.setColor('RED')
    this.setTitle('Closing ticket')
    this.setDescription(`Closed by <@${user.id}>`)
    this.setFooter('Deleting channel in 10 seconds')
    this.addField('Reason', reason)
  }
}
