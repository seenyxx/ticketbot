import { MessageEmbed } from 'discord.js'

export class CooldownMessage extends MessageEmbed {
  constructor(command: string, cooldown: number) {
    super()
    this.setColor('BLURPLE')
    this.setTitle('You cannot use this command yet!')
    this.setDescription(
      `You need to wait \`${
        Math.floor(cooldown / 100) / 10
      } seconds\` before you can use \`${command}\` again.`
    )
    this.setFooter('🦥 Slow down!')
  }
}
