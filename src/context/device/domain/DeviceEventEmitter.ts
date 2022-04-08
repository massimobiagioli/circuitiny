import EventEmitter from 'events'
import { match } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Logger } from 'pino'
import { UseCase } from '../../core/domain/UseCase'
import { RemoveDeviceRequest } from '../application/RemoveDeviceUseCase'
import { StoreDeviceRequest } from '../application/StoreDeviceUseCase'
import * as Device from './Device'

export interface DeviceConnectedEvent {
  id: string
  model: string
  address: string
  sketch: string
  occurredAt: number
}

export interface DeviceDisconnectedEvent {
  id: string
}

export type DispatchableEvents = DeviceConnectedEvent | DeviceDisconnectedEvent

export type DeviceEvents = {
  connected: (event: DeviceConnectedEvent) => void
  disconnected: (event: DeviceDisconnectedEvent) => void
}

export interface DeviceEvent {
  on<U extends keyof DeviceEvents>(event: U, listener: DeviceEvents[U]): this
  off<U extends keyof DeviceEvents>(event: U, listener: DeviceEvents[U]): this
  emit<U extends keyof DeviceEvents>(
    event: U,
    ...args: Parameters<DeviceEvents[U]>
  ): boolean
}

export class DeviceEventEmitter implements DeviceEvent {
  emitter: EventEmitter

  constructor() {
    this.emitter = new EventEmitter()
  }

  on<U extends keyof DeviceEvents>(event: U, listener: DeviceEvents[U]): this {
    this.emitter.on(event, listener)
    return this
  }

  off<U extends keyof DeviceEvents>(event: U, listener: DeviceEvents[U]): this {
    this.emitter.off(event, listener)
    return this
  }

  emit<U extends keyof DeviceEvents>(
    event: U,
    ...args: Parameters<DeviceEvents[U]>
  ): boolean {
    return this.emitter.emit(event, ...args)
  }
}

const getDeviceEventEmitter = (
  storeDeviceUseCase: UseCase<StoreDeviceRequest, void>,
  removeDeviceUseCase: UseCase<RemoveDeviceRequest, void>,
  logger: Logger
): DeviceEvent => {
  const deviceEventEmitter = new DeviceEventEmitter()

  deviceEventEmitter.on('connected', async (data) =>
    pipe(
      Device.fromConnectedEvent(data),
      match(
        (error) => logger.error(error.message),
        async (device) => await storeDeviceUseCase({ device })
      )
    )
  )

  deviceEventEmitter.on(
    'disconnected',
    async (data) => await removeDeviceUseCase({ deviceId: data.id })
  )

  return deviceEventEmitter
}

export default getDeviceEventEmitter
