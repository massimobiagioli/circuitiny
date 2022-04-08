import * as E from 'fp-ts/lib/Either'
import * as DeviceEvent from '../../../../../src/context/device/domain/DeviceEvent'
import {
  DeviceConnectedEvent,
  DeviceDisconnectedEvent
} from '../../../../../src/context/device/domain/DeviceEventEmitter'

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

  it('should return malformed input error', () => {
    const result = DeviceEvent.fromString('malformed string')

    expect(E.isLeft(result)).toBeTruthy()
    if (E.isLeft(result)) {
      const error = result.left
      expect(error.message).toBe('malformed input data')
    }
  })

  it('should create a dispatchable DeviceConnectedEvent', () => {
    const deviceEvent = {
      eventType: 'connected' as const,
      sender: {
        id: '123',
        model: 'ESP8266',
        address: '10.10.10.10',
        sketch: 'blink'
      },
      createdAt: 1588888888
    }

    const dispatchableEvent = DeviceEvent.toDispatchableEvent(deviceEvent)
    const dispatchableConnectedEvent = dispatchableEvent as DeviceConnectedEvent

    expect(dispatchableConnectedEvent.id).toBe('123')
    expect(dispatchableConnectedEvent.model).toBe('ESP8266')
    expect(dispatchableConnectedEvent.address).toBe('10.10.10.10')
    expect(dispatchableConnectedEvent.sketch).toBe('blink')
  })

  it('should create a dispatchable DeviceDisconnectedEvent', () => {
    const deviceEvent = {
      eventType: 'disconnected' as const,
      sender: {
        id: '123',
        model: 'ESP8266',
        address: '10.10.10.10',
        sketch: 'blink'
      },
      createdAt: 1588888888
    }

    const dispatchableEvent = DeviceEvent.toDispatchableEvent(deviceEvent)
    const dispatchableConnectedEvent =
      dispatchableEvent as DeviceDisconnectedEvent

    expect(dispatchableConnectedEvent.id).toBe('123')
  })
})
