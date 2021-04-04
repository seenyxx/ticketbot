import { MessageReaction, PartialUser, User, MessageEmbed, TextChannel } from 'discord.js';
import { Guild } from '../../database/guild'
import { TicketManager } from '../../database/tickets'
import { TICKET_REACTION, TICKET_MANAGER_ROLE } from '../../lib/constants'
import { TicketStart } from '../../renderers/ticketstart'
import { LogTicketOpen } from '../../renderers/openticketlog'
import { convertStringToUsable } from '../../lib/helpers';

export async function handleReaction(
  reaction: MessageReaction,
  user: User | PartialUser
) {
  if (reaction.message.partial) await reaction.message.fetch()
  if (reaction.partial) await reaction.fetch()
  if (user.partial) await user.fetch()
  if (user.bot) return

  if (!reaction.message.guild) return

  const guildDB = new Guild(reaction.message.guild.id)
  const ticketDB = new TicketManager(reaction.message.guild.id)

  const ticketPrompt = await guildDB.reactionPrompt()

  if (reaction.message.id === ticketPrompt) {
    reaction.users.remove(user as User)

    if (reaction.emoji.name === TICKET_REACTION) {
      const possibleChannel = reaction.message.guild.channels.cache.find(
        (c) => c.type === 'text' && (c as TextChannel).topic === user.id
      )

      if (possibleChannel) {
        reaction.message.channel
          .send(
            `<@${user.id}> You already have a ticket open! Please close that first!`
          )
          .then(m => m.delete({ timeout: 3000 }))

        return
      }

      const dm = await user.createDM()
      const catId = await guildDB.category()

      if ((await ticketDB.getTicketByDM(dm.id)) !== 'none') {
        reaction.message.channel
          .send(
            `<@${user.id}> You already have a ticket open! Please close that first!`
          )
          .then(m => m.delete({ timeout: 3000 }))

        return
      }

      const cat = reaction.message.guild.channels.cache.find(
        c => c.id === catId
      )

      if (!cat) return

      const guild = reaction.message.guild

      const channel = await guild.channels.create(
        convertStringToUsable(`${user.tag}`),
        {
          parent: cat,
          type: 'text',
          topic: user.id
        }
      )

      channel.createOverwrite(reaction.message.guild.roles.everyone, {
        SEND_MESSAGES: false,
        VIEW_CHANNEL: false
      })

      const embed = new TicketStart(`<@${user.id}>`)

      const channelEmbedMessage = await channel.send(embed)

      const dmEmbed = new TicketStart(
        `*${reaction.message.guild.name}*\n[\`[URL]\`](${channelEmbedMessage.url})`
      )

      dm.send(dmEmbed).catch(e => {
        reaction.message.channel
          .send(`<@${user.id}> I cannot send you a DM!`)
          .then(m => m.delete({ timeout: 3000 }))
      })

      const ticketManagerRole = reaction.message.guild.roles.cache.find(r =>
        r.name.toLowerCase().includes(TICKET_MANAGER_ROLE)
      )

      if (ticketManagerRole) {
        channel.createOverwrite(ticketManagerRole, {
          SEND_MESSAGES: true,
          VIEW_CHANNEL: true,
        })
      }

      const webhook = await channel.createWebhook(`${user.tag}'s Messages`, {
        avatar: user.displayAvatarURL(),
        reason: 'Create webhook for sending messages.',
      })

      ticketDB.addTicket(user.id, webhook.id)

      const logsWh = await guildDB.logsWebhook()

      const actualWh = (await reaction.message.guild.fetchWebhooks()).find(
        wh => wh.id === logsWh
      )

      if (actualWh) {
        const embed = new LogTicketOpen(user as User, channel)

        actualWh.send(embed)
      }
    }
  }
}
