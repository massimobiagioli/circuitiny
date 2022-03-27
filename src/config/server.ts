type ServerConfig = {
  port: number
}

const DEFAULT_SERVER_PORT = 8080

const getConfig = (): ServerConfig => ({
  port: process.env.SERVER_PORT
    ? parseInt(process.env.SERVER_PORT)
    : DEFAULT_SERVER_PORT
})

export { getConfig }
