import { MongoMemoryServer } from 'mongodb-memory-server'
import * as App from '../../../../../../src/app'
import { connect, disconnect } from 'mongoose'

describe('DeviceController', () => {
  let mongoServer: MongoMemoryServer
  const app = App.create()

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    await connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await disconnect()
    await mongoServer.stop()
  })

  it('should check for health', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe('health ok!')
  })
})
