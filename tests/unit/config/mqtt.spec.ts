import * as mqtt from '../../../src/config/mqtt'

describe('MqttConfig', () => {
  const env = Object.assign({}, process.env)

  afterAll(() => {
    process.env = env
  })

  it('should return broker url', () => {
    process.env.MQTT_BROKER_URL = 'mqtt://test-broker'
    const url = mqtt.brokerUrl()

    expect(url).toBe('mqtt://test-broker')
  })

  it('should return default broker url', () => {
    delete process.env.MQTT_BROKER_URL
    const url = mqtt.brokerUrl()

    expect(url).toBe('mqtt://localhost')
  })
})
