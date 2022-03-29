import * as E from 'fp-ts/lib/Either'
import * as DeviceEvent from '../../../../../src/context/device/domain/DeviceEvent'

describe('DeviceEvent', () => {
  it('should create a DeviceEvent from raw string', () => {
    const rawString = `{
        "eventType": "connected",
        "sender": {
            "id": "123",
            "model": "ESP8266",
            "address": "10.10.10.10", 
            "sketch": "blink"        
        },
        "createdAt": 1588888888
    }`

    const result = DeviceEvent.fromString(rawString)

    expect(E.isRight(result)).toBeTruthy()
  })

  it('should return validation error', () => {
    const rawString = `{
        "eventType": "connected",
        "sender": {
            "id": "123",
            "model": "ESP8266",
            "address": "-", 
            "sketch": "blink"        
        },
        "createdAt": 1588888888
    }`

    const result = DeviceEvent.fromString(rawString)

    expect(E.isLeft(result)).toBeTruthy()
    if (E.isLeft(result)) {
      const error = result.left
      expect(error.message).toBe('/sender/address must match format "ipv4"')
    }
  })
})