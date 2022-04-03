import * as deps from '../../../../../src/config/deps'
import { container } from '../../../../../src/config/deps'
import { UseCase } from '../../../../../src/context/core/domain/UseCase'
import { HandleDeviceEventRequest } from '../../../../../src/context/device/application/HandleDeviceEventUseCase'
import { DEVICES, RAW_MESSAGES } from '../../../../helper/Device'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { Logger } from 'pino'
import DeviceEventRepository from '../../../../../src/context/device/domain/DeviceEventRepository'

type InvokeUseCaseResult = {
  logger: StubbedInstance<Logger>
  deviceEventRepository: StubbedInstance<DeviceEventRepository>
}

async function testUseCase(
  request?: HandleDeviceEventRequest
): Promise<InvokeUseCaseResult> {
  const stubLogger: StubbedInstance<Logger> = stubInterface<Logger>()
  const stubDeviceEventRepository: StubbedInstance<DeviceEventRepository> =
    stubInterface<DeviceEventRepository>()

  container.register(deps.KEYS.LOGGER, {
    useValue: stubLogger
  })
  container.register(deps.KEYS.DEVICE_EVENT_REPOSITORY, {
    useValue: stubDeviceEventRepository
  })

  const useCase = container.resolve<UseCase<HandleDeviceEventRequest, void>>(
    deps.KEYS.HANDLE_DEVICE_EVENT_USE_CASE
  )

  await useCase(request)

  return {
    logger: stubLogger,
    deviceEventRepository: stubDeviceEventRepository
  }
}

describe('DeviceEventUseCase', () => {
  it('should handle connected event', async () => {
    const { deviceEventRepository } = await testUseCase({
      device: DEVICES.ESP8266_01,
      rawEvent: RAW_MESSAGES.CONNECTED
    })

    expect(deviceEventRepository.store.callCount).toBe(1)
  })

  it('should handle disconnected event', async () => {
    const { deviceEventRepository } = await testUseCase({
      device: DEVICES.ESP8266_01,
      rawEvent: RAW_MESSAGES.DISCONNECTED
    })

    expect(deviceEventRepository.store.callCount).toBe(1)
  })

  it('should discard an empty event', async () => {
    const { logger, deviceEventRepository } = await testUseCase(undefined)

    expect(deviceEventRepository.store.callCount).toBe(0)
    expect(logger.error.calledWith('empty event received')).toBeTruthy()
  })

  it('should discard an event with validation error', async () => {
    const eventWithValidationError = `{"sender": {"id": "esp8266-01", "sketch": "dummy", "model": "ESP8266", "address": "asdf"}, "createdAt": 702293518, "eventType": "connected"}`
    const { logger, deviceEventRepository } = await testUseCase({
      device: DEVICES.ESP8266_01,
      rawEvent: eventWithValidationError
    })

    expect(deviceEventRepository.store.callCount).toBe(0)
    expect(
      logger.error.calledWith(`/sender/address must match format "ipv4"`)
    ).toBeTruthy()
  })

  it('should discard a malformed event', async () => {
    const malformedEvent = 'maformed event'
    const { logger, deviceEventRepository } = await testUseCase({
      device: DEVICES.ESP8266_01,
      rawEvent: malformedEvent
    })

    expect(deviceEventRepository.store.callCount).toBe(0)
    expect(logger.error.calledWith('malformed input data')).toBeTruthy()
  })
})
