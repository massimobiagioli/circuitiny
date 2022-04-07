import EventEmitter from 'events'
import { match } from 'fp-ts/lib/Either'
import { pipe } from 'fp-ts/lib/function'
import { Logger } from 'pino'
import * as Device from './Device'
import DeviceRepository from './DeviceRepository'

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

  constructor(private readonly deviceRepository: DeviceRepository) {
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
  deviceRepository: DeviceRepository,
  logger: Logger
): DeviceEvent => {
  const deviceEventEmitter = new DeviceEventEmitter(deviceRepository)

  deviceEventEmitter.on('connected', async (data) =>
    pipe(
      Device.fromDeviceEventConnectedEvent(data),
      match(
        (error) => logger.error(error.message),
        async (device) => await deviceRepository.store(device)
      )
    )
  )

  deviceEventEmitter.on(
    'disconnected',
    async (data) => await deviceRepository.remove(data.id)
  )

  return deviceEventEmitter
}

export default getDeviceEventEmitter
