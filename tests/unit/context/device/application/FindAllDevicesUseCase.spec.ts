import * as deps from '../../../../../src/config/deps'
import { container } from '../../../../../src/config/deps'
import { UseCase } from '../../../../../src/context/core/domain/UseCase'
import { StubbedInstance, stubInterface } from 'ts-sinon'
import { Logger } from 'pino'
import { Device } from '../../../../../src/context/device/domain/Device'
import DeviceRepository from '../../../../../src/context/device/domain/DeviceRepository'

type UseCaseOptions = {
  devices: Device[]
}

async function testUseCase(options: UseCaseOptions): Promise<Device[]> {
  const stubLogger: StubbedInstance<Logger> = stubInterface<Logger>()
  const stubDeviceRepository: StubbedInstance<DeviceRepository> =
    stubInterface<DeviceRepository>()

  stubDeviceRepository.findAll.resolves(options.devices)

  container.register(deps.keys.logger, {
    useValue: stubLogger
  })
  container.register(deps.keys.deviceRepository, {
    useValue: stubDeviceRepository
  })

  const useCase = container.resolve<UseCase<never, Promise<Device[]>>>(
    deps.keys.findAllDevicesUseCase
  )

  return await useCase()
}

describe('DeviceEventUseCase', () => {
  it('should return empty list', async () => {
    const devices = await testUseCase({ devices: [] })

    expect(devices).toHaveLength(0)
  })

  it('should return a list of devices', async () => {
    const fakeDevices: Device[] = [
      {
        id: '1',
        model: 'device1',
        address: '10.10.10.1',
        sketch: 'test sketch 1'
      },
      {
        id: '2',
        model: 'device2',
        address: '10.10.10.2',
        sketch: 'test sketch 2'
      }
    ]

    const devices = await testUseCase({ devices: fakeDevices })

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
