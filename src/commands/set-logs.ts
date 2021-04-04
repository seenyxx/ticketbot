import { createCommand } from '../client/command'
import { Message } from 'discord.js'
import { Guild } from '../database/guild'
import { SetLogsChannel } from '../renderers/setlogschannel'

export default createCommand(
  {
    triggers: ['set-logs', 'logs', 'setlogs', 'set-log', 'setlog'],
    cooldown: 10,
    guildOnly: true,
    userPerms: ['MANAGE_CHANNELS'],
  },
  async (msg: Message, args: string[]) => {
    if (!msg.guild || !msg.guild.me) return

    const guildDB = new Guild(msg.guild.id)
    const channel = msg.mentions.channels.first() || msg.channel

    if (channel.type !== 'text')
      throw new Error('The channel must be a standard text channel!')
    if (channel.guild.id !== msg.guild.id)
      throw new Error('The channel must be in the this server!')

    const wh = await channel.createWebhook(msg.guild.me.user.username, {
      avatar: msg.guild.me.user.displayAvatarURL(),
      reason: 'Logs for tickets',
    })

    await guildDB.setLogsWebhook(wh.id)

    const embed = new SetLogsChannel(channel)

    msg.channel.send(embed)
  }
)
