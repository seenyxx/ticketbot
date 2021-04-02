import { ShardingManager } from "discord.js";
import { getConfig } from './lib/helpers';

const config = getConfig()

const manager = new ShardingManager(`${__dirname}/client/main.js`, {
  token: config.token
})

manager.spawn()