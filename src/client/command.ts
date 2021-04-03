import { Message, PermissionResolvable } from 'discord.js'

export function createCommand(
  opts: CommandOpts,
  exec: CommandFunction
): Command {
  return {
    opts: opts,
    execute: exec,
  }
}
export interface Command {
  opts: CommandOpts
  execute: CommandFunction
}
export type CommandFunction = (message: Message, args: string[]) => Promise<any>

export interface CommandOpts {
  triggers: string[]
  cooldown: number
  userPerms?: PermissionResolvable[]
  guildOnly?: boolean
}
