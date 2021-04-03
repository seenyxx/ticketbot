import { Database, QuickMongoError } from 'quickmongo'
import { getConfig } from '../lib/helpers'
import { CategoryChannel, Message } from 'discord.js'

const config = getConfig()
const guilds = new Database(config.database).createModel('guilds')

export class Guild {
  readonly id

  /**
   *
   * @param id Discord Guild id
   */
  constructor(id: string) {
    this.id = id
  }

  private select(selection: string) {
    return `${this.id}.${selection}`
  }

  setReactionPrompt(m: Message) {
    guilds.set(this.select('reaction'), m.id)
  }

  async reactionPrompt(): Promise<string | 'none'> {
    return (await guilds.get(this.select('reaction'))) || 'none'
  }

  removeReactionPrompt() {
    guilds.delete(this.select('reaction'))
  }

  setCategory(cat: CategoryChannel) {
    guilds.set(this.select('ticketCategory'), cat.id)
  }

  async category(): Promise<string | 'none'> {
    return (await guilds.get(this.select('ticketCategory'))) || 'none'
  }

  removeCategory() {
    guilds.delete(this.select('ticketCategory'))
  }
}
