import { TickBotClient } from './client';
import { getConfig } from '../lib/helpers';

const client = new TickBotClient()

client.login(getConfig().token)