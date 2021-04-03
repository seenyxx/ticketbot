import { Message } from 'discord.js'
import { getConfig } from '../../lib/helpers'
import { botCache } from '../cache'
import { ErrorMessage } from '../../renderers/error'
import { createCooldown, checkCooldown } from './cooldowns'
import { CooldownMessage } from '../../renderers/cooldown'

const config = getConfig()

export const commandMessage = (message: Message) => {
  if (message.author.bot || !message.content.startsWith(config.prefix)) return

  const args = message.content
    .substr(config.prefix.length, message.content.length)
    .split(/ +/)
  const command = args.shift()

  if (!command) return

  const commandProps = botCache.commands.get(command)

  if (!commandProps) return

  if (commandProps.opts.guildOnly && !message.guild) return

  if (commandProps.opts.userPerms && message.member) {
    const member = message.member

    const hasPerm = commandProps.opts.userPerms.every(perm =>
      member.hasPermission(perm)
    )

    if (!hasPerm) {
      return message.reply(
        new ErrorMessage(
          'You do not have the required permissions to use this command!'
        )
      )
    }
  }

  const cooldown = checkCooldown(
    message.author.id,
    commandProps.opts.triggers[0]
  )
  if (cooldown) {
    const msg = new CooldownMessage(command, cooldown)

    return message.reply(msg)
  }

  commandProps
    .execute(message, args)
    .catch(e => message.reply(new ErrorMessage(e)))
  createCooldown(
    message.author.id,
    commandProps.opts.triggers[0],
    commandProps.opts.cooldown
  )
}
