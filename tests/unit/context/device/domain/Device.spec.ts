import * as E from 'fp-ts/lib/Either'
import * as Device from '../../../../../src/context/device/domain/Device'
import { DeviceConnectedEvent } from '../../../../../src/context/device/domain/DeviceEventEmitter'
import { DeviceDocument } from '../../../../../src/context/device/infrastructure/mongoose/DeviceMongooseModel'

describe('Device', () => {
  it('should create a Device from connected event', () => {
    const event: DeviceConnectedEvent = {
      id: '123',
      model: 'ESP8266',
      address: '10.10.10.10',
      sketch: 'blink',
      occurredAt: 1588888888
    }

    const result = Device.fromConnectedEvent(event)

    expect(E.isRight(result)).toBeTruthy()
  })

  it('should return validation error', () => {
    const event: DeviceConnectedEvent = {
      id: '123',
      model: 'ESP8266',
      address: '-',
      sketch: 'blink',
      occurredAt: 1588888888
    }

    const result = Device.fromConnectedEvent(event)

    expect(E.isLeft(result)).toBeTruthy()
    if (E.isLeft(result)) {
      const error = result.left
      expect(error.message).toBe('/address must match format "ipv4"')
    }
  })

  it('should create a Device from primitive', () => {
    const document: DeviceDocument = {
      id: '123',
      model: 'ESP8266',
      address: '10.10.10.10',
      sketch: 'blink'
    }

    const device = Device.fromPrimitive(document)

    expect(device.id).toBe('123')
    expect(device.model).toBe('ESP8266')
    expect(device.address).toBe('10.10.10.10')
    expect(device.sketch).toBe('blink')
  })
})
