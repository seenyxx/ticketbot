import { Client } from 'discord.js'
import { commandMessage } from './handlers/commandMessage'
import { loadCommands } from './loaders/commandLoader'
import { handleReaction } from './handlers/reaction'
import { ticketMessage } from './handlers/ticketMessage';

export class TicketBotClient extends Client {
  constructor() {
    super({
      partials: ['MESSAGE', 'USER', 'REACTION'],
    })
  }

  async loadEvents() {
    loadCommands(`${__dirname}/../commands`)
    this.on('ready', () => console.log('Ready!'))

    this.on('message', message => {
      commandMessage(message)
      ticketMessage(this, message)
    })

    this.on('messageReactionAdd', handleReaction)
  }

  async init(token: string) {
    await this.loadEvents()
    this.login(token)
  }
}

export const sleep = (ms: number) => new Promise(res => setTimeout(res, ms))
