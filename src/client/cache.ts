import { Collection } from 'discord.js'
import { Command } from './command'

export const botCache = {
  commands: new Collection<string, Command>(),
}
