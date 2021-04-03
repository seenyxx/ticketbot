import { MessageEmbed, TextChannel } from 'discord.js'

export class SetLogsChannel extends MessageEmbed {
  constructor(c: TextChannel) {
    super()
    this.setColor('GREEN')
    this.setTitle('Logs')
    this.setDescription(`Set the logs channel to <#${c.id}>`)
  }
}
