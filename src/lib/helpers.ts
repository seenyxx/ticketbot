import { MENTION_REGEX } from './constants';
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


export function convertStringToUsable(string: string) {
  return string.replace(/[^a-zA-Z0-9-_]/g, '');
}

export function cleanPings(content: string) {
  return content.replace(MENTION_REGEX, '\`[Deleted Mention]\`')
}