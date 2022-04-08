import { Device } from '../domain/Device'
import DeviceRepository from '../domain/DeviceRepository'

const FindAllDevicesEventUseCase =
  (deviceRepository: DeviceRepository) => async (): Promise<Device[]> => {
    return await deviceRepository.findAll()
  }

export default FindAllDevicesEventUseCase
