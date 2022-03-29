import * as V from '../../../../../src/context/core/domain/Validation'
import { DeviceEvent } from '../../../../../src/context/device/domain/DeviceEvent'

describe('Validation', () => {
  it('should return error message', () => {
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

    const validate = V.compiler.compile(DeviceEvent)
    validate(JSON.parse(rawString))

    expect(V.errorString(validate.errors)).toBe(
      '/sender/address must match format "ipv4"'
    )
  })

  it('should return unknown error message', () => {
    expect(V.errorString(null)).toBe('validation failed')
  })
})
