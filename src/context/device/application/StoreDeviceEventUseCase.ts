import { Logger } from 'pino'
import DeviceEvent from '../domain/DeviceEvent'
import DeviceEventRepository from '../domain/DeviceEventRepository'

type StoreDeviceEventRequest = {
  event: DeviceEvent
}

class StoreDeviceEventUseCase
  implements UseCase<StoreDeviceEventRequest, void>
{
  constructor(
    private readonly deviceEventRepository: DeviceEventRepository,
    private readonly logger: Logger
  ) {}

  async invoke(request?: StoreDeviceEventRequest): Promise<void> {
    if (request?.event === undefined) {
      this.logger.error('StoreDeviceEventUseCase: event is required')
      return
    }
    this.deviceEventRepository.store(request.event)
  }
}
