import { ShardingManager } from 'discord.js'
import { getConfig } from './lib/helpers'

process.on('unhandledRejection', console.error)

const config = getConfig()

const manager = new ShardingManager(`${__dirname}/client/main.js`, {
  token: config.token,
})

manager.on('shardCreate', shard => console.log(`Created shard [${shard.id}]`))

manager.spawn()
