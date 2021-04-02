export function getConfig(): Config {
  const env = process.env.NODE_ENV

  if (env !== 'production') {
    return JSON.parse(require(`${__dirname}/../../config.json`))
  }
  else {
    return JSON.parse(require(`${__dirname}/../../config.dev.json`))
  }
}

export interface Config {
  token: string
  prefix: string
}