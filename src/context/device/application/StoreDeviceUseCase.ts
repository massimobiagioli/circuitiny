import { Logger } from 'pino'
import { Device } from '../domain/Device'
import DeviceRepository from '../domain/DeviceRepository'

export type StoreDeviceRequest = {
  device: Device
}

const StoreDeviceEventUseCase =
  (deviceRepository: DeviceRepository, logger: Logger) =>
  async (request?: StoreDeviceRequest): Promise<void> => {
    if (request === undefined) {
      logger.error('empty request received')
      return
    }
    await deviceRepository.store(request.device)
  }

export default StoreDeviceEventUseCase
