import app, { up, down } from '../../../../../helper/AppContext'

describe('DeviceController', () => {
  beforeAll(async () => {
    await up()
  })

  afterAll(async () => {
    await down()
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
