import { match } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Logger } from 'pino'
import * as DeviceEvent from '../domain/DeviceEvent'
import * as Emitter from '../domain/DeviceEventEmitter'
import DeviceEventRepository from '../domain/DeviceEventRepository'

export type HandleDeviceEventRequest = {
  device: string
  rawEvent: string
}

const HandleDeviceEventUseCase =
  (
    deviceEventRepository: DeviceEventRepository,
    logger: Logger,
    emitter: Emitter.DeviceEvent
  ) =>
  async (request?: HandleDeviceEventRequest): Promise<void> => {
    if (request === undefined) {
      logger.error('empty event received')
      return
    }

    const event = DeviceEvent.fromString(request.rawEvent)
    pipe(
      event,
      match(
        (error) => logger.error(error.message),

        async (eventData) => {
          logger.info(
            `event received: ${eventData.eventType.toString()} - device: ${
              request.device
            }`
          )

          await deviceEventRepository.store(eventData)

          emitter.emit(
            eventData.eventType,
            DeviceEvent.toDispatchableEvent(eventData)
          )
        }
      )
    )
  }

export default HandleDeviceEventUseCase
