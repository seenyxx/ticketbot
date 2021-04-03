import { TicketBotClient } from './client'
import { getConfig } from '../lib/helpers'

process.on('unhandledRejection', console.error)

const client = new TicketBotClient()

client.init(getConfig().token)
