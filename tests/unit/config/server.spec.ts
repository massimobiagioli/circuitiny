import * as server from '../../../src/config/server'

describe('ServerConfig', () => {
  const env = Object.assign({}, process.env)

  afterAll(() => {
    process.env = env
  })

  it('should return server port', () => {
    process.env.SERVER_PORT = '4000'
    const port = server.port()

    expect(port).toBe(4000)
  })

  it('should return default port', () => {
    delete process.env.SERVER_PORT
    const port = server.port()

    expect(port).toBe(8080)
  })
})
