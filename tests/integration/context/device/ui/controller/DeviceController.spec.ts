import devices from '../../../../../fixtures/devices'
import app, { up, down } from '../../../../../helper/AppContext'

describe('DeviceController', () => {
  beforeAll(async () => {
    await up()
  })

  afterAll(async () => {
    await down()
  })

  it('should find all devices', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/api/device'
    })

    expect(response.statusCode).toBe(200)
    expect(response.body).toBe(JSON.stringify(devices))
  })
})
