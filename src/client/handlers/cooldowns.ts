import db from 'quick.db'

export function createCooldown(
  id: string,
  commandName: string,
  cooldownSecs: number
) {
  db.set(`${id}.${commandName}`, Date.now() + cooldownSecs * 1000)
}

export function getCooldown(id: string, commandName: string) {
  return db.get(`${id}.${commandName}`) || 0
}

export function checkCooldown(id: string, commandName: string) {
  const currentCooldown = getCooldown(id, commandName)
  const now = Date.now()

  if (currentCooldown > now) {
    return currentCooldown - now
  }
}
