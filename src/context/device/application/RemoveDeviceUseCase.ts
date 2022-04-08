import { Logger } from 'pino'
import DeviceRepository from '../domain/DeviceRepository'

export type RemoveDeviceRequest = {
  deviceId: string
}

const RemoveDeviceEventUseCase =
  (deviceRepository: DeviceRepository, logger: Logger) =>
  async (request?: RemoveDeviceRequest): Promise<void> => {
    if (request === undefined) {
      logger.error('empty request received')
      return
    }
    await deviceRepository.remove(request.deviceId)
  }

export default RemoveDeviceEventUseCase
