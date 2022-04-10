import { MongoMemoryServer } from 'mongodb-memory-server'
import * as App from '../../../../../../src/app'
import { connect, disconnect } from 'mongoose'

//TODO: https://nodkz.github.io/mongodb-memory-server/docs/guides/integration-examples/test-runners/

describe('DeviceController', async () => {
  const mongoServer = await MongoMemoryServer.create()
  const app = App.create()

  beforeAll(async () => {
    await connect(mongoServer.getUri())
  })

  afterAll(async () => {
    await disconnect()
    await mongoServer.stop()
  })

  it('should find all devices', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/device'
    })

    expect(response.statusCode).toBe(200)
  })
})
