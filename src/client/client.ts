import { Client } from 'discord.js'

export class TickBotClient extends Client {
  constructor() {
    super()
  }

  async loadEvents() {
    this.on('ready', () => console.log('Ready!'))

    this.on('message', (message) => {})
  }

  async init(token: string) {
    await this.loadEvents()
    this.login(token)
  }
}
