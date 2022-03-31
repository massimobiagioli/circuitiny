import { isLeft } from 'fp-ts/lib/Either'
import { Logger } from 'pino'
import { inject, injectable } from 'tsyringe'
import UseCase from '../../core/application/UseCase'
import * as DeviceEvent from '../domain/DeviceEvent'
import DeviceEventRepository from '../domain/DeviceEventRepository'

export type HandleDeviceEventRequest = {
  device: string
  rawEvent: string
}

@injectable()
export default class HandleDeviceEventUseCase
  implements UseCase<HandleDeviceEventRequest, void>
{
  constructor(
    @inject('DeviceEventRepository')
    private readonly deviceEventRepository: DeviceEventRepository,
    @inject('Logger')
    private readonly logger: Logger
  ) {}

  async invoke(request?: HandleDeviceEventRequest): Promise<void> {
    if (request === undefined) {
      this.logger.error('empty event received')
      return
    }

    const event = DeviceEvent.fromString(request.rawEvent)
    if (isLeft(event)) {
      this.logger.error(event.left)
      return
    }

    const eventData = event.right
    this.logger.info(
      `event received: ${eventData.eventType.toString()} - device: ${
        request.device
      }`
    )

    console.log('call deviceEventRepository.store ...')
    //this.deviceEventRepository.store(eventData)
  }
}
