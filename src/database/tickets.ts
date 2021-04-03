import { Database } from 'quickmongo'
import { getConfig } from '../lib/helpers'

const config = getConfig()

const tickets = new Database(config.database).createModel('tickets')

export class TicketManager {
  readonly id

  /**
   *
   * @param id Discord Guild id
   */
  constructor(id?: string) {
    this.id = id
  }

  private select(selection: string) {
    return `ticket_${selection}`
  }

  wrapObject(id: string) {
    if (!this.id)
      throw new Error('Cannot wrap object as you have not provided a guild id!')
    return JSON.stringify({
      guild: this.id,
      value: id,
    })
  }

  unwrap(obj: string) {
    return JSON.parse(obj)
  }

  addTicket(dmId: string, webhookId: string) {
    tickets.set(this.select(`dm.${dmId}`), this.wrapObject(webhookId))
    tickets.set(this.select(`webhook.${webhookId}`), this.wrapObject(dmId))
  }

  remTicket(dmId: string, webhookId: string) {
    tickets.delete(this.select(`dm.${dmId}`))
    tickets.delete(this.select(`webhook.${webhookId}`))
  }

  async getTicketByDM(dmId: string): Promise<ChannelProps | 'none'> {
    return this.unwrap((await tickets.get(this.select(`dm.${dmId}`)))) || 'none'
  }

  async getTicketByChannel(webhookId: string): Promise<DMProps | 'none'> {
    return this.unwrap((await tickets.get(this.select(`webhook.${webhookId}`)))) || 'none'
  }
}

interface Ticket {
  guild: string
  value: string
}

interface ChannelProps extends Ticket {}

interface DMProps extends Ticket {}
