import * as deps from '../../../../../src/config/deps'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { Logger } from 'pino'
import { Device } from '../../../../../src/context/device/domain/Device'
import DeviceRepository from '../../../../../src/context/device/domain/DeviceRepository'
import { FAKE_DEVICES } from '../../../../helper/Device'

type UseCaseOptions = {
  devices: Device[]
}

async function testUseCase(options: UseCaseOptions): Promise<Device[]> {
  const stubLogger: StubbedInstance<Logger> = stubInterface<Logger>()
  const stubDeviceRepository: StubbedInstance<DeviceRepository> =
    stubInterface<DeviceRepository>()

  stubDeviceRepository.findAll.resolves(options.devices)

  deps.container.register(deps.keys.logger, {
    useValue: stubLogger
  })
  deps.container.register(deps.keys.deviceRepository, {
    useValue: stubDeviceRepository
  })

  const useCase = deps.container.resolve(deps.keys.findAllDevicesUseCase)

  return await useCase()
}

describe('FindAllDevicesUseCase', () => {
  it('should return empty list', async () => {
    const devices = await testUseCase({ devices: [] })

    expect(devices).toHaveLength(0)
  })

  it('should return a list of devices', async () => {
    const devices = await testUseCase({ devices: FAKE_DEVICES })

    expect(devices).toHaveLength(2)
    expect(devices[0].id).toBe('1')
    expect(devices[0].model).toBe('device1')
    expect(devices[0].address).toBe('10.10.10.1')
    expect(devices[0].sketch).toBe('test sketch 1')
    expect(devices[1].id).toBe('2')
    expect(devices[1].model).toBe('device2')
    expect(devices[1].address).toBe('10.10.10.2')
    expect(devices[1].sketch).toBe('test sketch 2')
  })
})
