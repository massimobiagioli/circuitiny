import { isLeft } from 'fp-ts/lib/Either'
import { Logger } from 'pino'
import * as DeviceEvent from '../domain/DeviceEvent'
import DeviceEventRepository from '../domain/DeviceEventRepository'

export type HandleDeviceEventRequest = {
  device: string
  rawEvent: string
}

const HandleDeviceEventUseCase =
  (deviceEventRepository: DeviceEventRepository, logger: Logger) =>
  async (request?: HandleDeviceEventRequest): Promise<void> => {
    if (request === undefined) {
      logger.error('empty event received')
      return
    }

    const event = DeviceEvent.fromString(request.rawEvent)
    if (isLeft(event)) {
      logger.error(event.left.message)
      return
    }

    const eventData = event.right
    logger.info(
      `event received: ${eventData.eventType.toString()} - device: ${
        request.device
      }`
    )

    await deviceEventRepository.store(eventData)
  }

export default HandleDeviceEventUseCase
