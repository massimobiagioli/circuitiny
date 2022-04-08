import * as deps from '../../../../../src/config/deps'
import { Logger } from 'pino'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import {
  DeviceConnectedEvent,
  DeviceDisconnectedEvent,
  DeviceEvents
} from '../../../../../src/context/device/domain/DeviceEventEmitter'
import * as DeviceEvent from '../../../../../src/context/device/domain/DeviceEvent'
import DeviceRepository from '../../../../../src/context/device/domain/DeviceRepository'

type InvokeUseCaseResult = {
  logger: StubbedInstance<Logger>
  deviceRepository: StubbedInstance<DeviceRepository>
}

function testCase<U extends keyof DeviceEvents>(
  event: U,
  ...args: Parameters<DeviceEvents[U]>
): InvokeUseCaseResult {
  const stubLogger: StubbedInstance<Logger> = stubInterface<Logger>()
  const stubDeviceRepository: StubbedInstance<DeviceRepository> =
    stubInterface<DeviceRepository>()

  deps.container.register(deps.keys.logger, {
    useValue: stubLogger
  })
  deps.container.register(deps.keys.deviceRepository, {
    useValue: stubDeviceRepository
  })

  const emitter = deps.container.resolve(deps.keys.deviceEventEmitter)

  emitter.emit(event, ...args)

  return {
    logger: stubLogger,
    deviceRepository: stubDeviceRepository
  }
}

describe('DeviceEventEmitter', () => {
  it('should handle device connected event', () => {
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

    const { deviceRepository } = testCase(
      'connected',
      dispatchableConnectedEvent
    )

    expect(deviceRepository.store.callCount).toBe(1)
  })

  it('should handle device disconnected event', () => {
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
    const dispatchableDisconnectedEvent =
      dispatchableEvent as DeviceDisconnectedEvent

    const { deviceRepository } = testCase(
      'disconnected',
      dispatchableDisconnectedEvent
    )

    expect(deviceRepository.remove.callCount).toBe(1)
  })
})
