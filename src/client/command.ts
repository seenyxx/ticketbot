import { Message, PermissionResolvable } from "discord.js";

export function Command(opts: CommandOpts, exec: CommandFunction) {
  return {
    opts: opts,
    execute: exec
  }
}

export type CommandFunction = (message: Message) => Promise<any> 

export interface CommandOpts {
  triggers: string[]
  cooldown: number
  userPerms: PermissionResolvable[]
}