export function getConfig(): Config {
  const env = process.env.NODE_ENV

  if (env === 'production') {
    return require(`${__dirname}/../../config.json`)
  } else {
    return require(`${__dirname}/../../config.dev.json`)
  }
}

export interface Config {
  token: string
  prefix: string
  database: string
}
