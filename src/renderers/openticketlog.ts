import { MessageEmbed, TextChannel, User } from 'discord.js';

export class LogTicketOpen extends MessageEmbed {
  constructor(user: User, c: TextChannel) {
    super()
    this.setColor('GREEN')
    this.setTitle(`Ticket Open - ${c.name}`)
    this.addField('Channel', `<#${c.id}>`)
    this.setDescription(`Ticket opened by <@${user.id}>`)
    this.setTimestamp(Date.now())
  }
}
