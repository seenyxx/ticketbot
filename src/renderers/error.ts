import { MessageEmbed } from 'discord.js'

export class ErrorMessage extends MessageEmbed {
  constructor(error: string) {
    super()
    this.setColor('RED')
    this.setTitle('Error!')
    this.setDescription(error)
  }
}
