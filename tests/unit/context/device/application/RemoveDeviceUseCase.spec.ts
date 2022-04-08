import * as deps from '../../../../../src/config/deps'
import { container } from '../../../../../src/config/deps'
import { UseCase } from '../../../../../src/context/core/domain/UseCase'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { Logger } from 'pino'
import DeviceRepository from '../../../../../src/context/device/domain/DeviceRepository'
import { RemoveDeviceRequest } from '../../../../../src/context/device/application/RemoveDeviceUseCase'

type InvokeUseCaseResult = {
  logger: StubbedInstance<Logger>
  deviceRepository: StubbedInstance<DeviceRepository>
}

async function testUseCase(
  request?: RemoveDeviceRequest
): Promise<InvokeUseCaseResult> {
  const stubLogger: StubbedInstance<Logger> = stubInterface<Logger>()
  const stubDeviceRepository: StubbedInstance<DeviceRepository> =
    stubInterface<DeviceRepository>()

  container.register(deps.keys.logger, {
    useValue: stubLogger
  })
  container.register(deps.keys.deviceRepository, {
    useValue: stubDeviceRepository
  })

  const useCase = container.resolve<UseCase<RemoveDeviceRequest, void>>(
    deps.keys.removeDeviceUseCase
  )

  await useCase(request)

  return {
    logger: stubLogger,
    deviceRepository: stubDeviceRepository
  }
}

describe('DeviceEventUseCase', () => {
  it('should store device', async () => {
    const { deviceRepository } = await testUseCase({
      deviceId: '1'
    })

    expect(deviceRepository.remove.callCount).toBe(1)
  })

  it('should discard an empty request', async () => {
    const { logger, deviceRepository } = await testUseCase(undefined)

    expect(deviceRepository.remove.callCount).toBe(0)
    expect(logger.error.calledWith('empty request received')).toBeTruthy()
  })
})
