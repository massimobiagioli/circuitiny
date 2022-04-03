import * as O from 'fp-ts/lib/Option'

export type MongoConf = {
  url: () => O.Option<string>
}

export const url = (): O.Option<string> => {
  if (process.env.MONGO_DB_URL === undefined) {
    return O.none
  }
  return O.some(process.env.MONGO_DB_URL)
}
