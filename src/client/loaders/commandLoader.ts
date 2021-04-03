import { readdir } from 'fs/promises'
import { Command } from '../command'
import { botCache } from '../cache'

export async function loadCommands(path: string) {
  for (const f of await readdir(path)) {
    const extension = f.split('.')[1]

    if (extension == 'js') {
      const command = (await import(`${path}/${f}`)).default as Command

      command.opts.triggers.forEach(trigger => {
        if (!botCache.commands.get(trigger)) {
          console.log(
            `[CMD] -> Loading trigger: ${trigger} for command: ${command.opts.triggers[0]}`
          )
          botCache.commands.set(trigger, command)
        }
      })
    } else if (!extension) {
      loadCommands(`${path}/${f}`)
    }
  }
}
