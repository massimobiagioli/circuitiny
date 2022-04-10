import * as deps from '../../../../../src/config/deps'
import { HandleDeviceEventRequest } from '../../../../../src/context/device/application/HandleDeviceEventUseCase'
import { DEVICES, RAW_MESSAGES } from '../../../../helper/Device'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { Logger } from 'pino'
import DeviceEventRepository from '../../../../../src/context/device/domain/DeviceEventRepository'
import DeviceRepository from '../../../../../src/context/device/domain/DeviceRepository'

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
  const stubDeviceRepository: StubbedInstance<DeviceRepository> =
    stubInterface<DeviceRepository>()

  deps.container.register(deps.keys.logger, {
    useValue: stubLogger
  })
  deps.container.register(deps.keys.deviceEventRepository, {
    useValue: stubDeviceEventRepository
  })
  deps.container.register(deps.keys.deviceRepository, {
    useValue: stubDeviceRepository
  })

  const useCase = deps.container.resolve(deps.keys.handleDeviceEventUseCase)

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
    const eventWithValidationError = RAW_MESSAGES.WITH_VALIDATION_ERROR
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
