const DEFAULT_SERVER_PORT = 8080

export type ServerConf = {
  port: () => number
}

export const port = (): number =>
  process.env.SERVER_PORT
    ? parseInt(process.env.SERVER_PORT)
    : DEFAULT_SERVER_PORT
