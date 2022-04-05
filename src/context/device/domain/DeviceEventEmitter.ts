import EventEmitter from 'events'

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

const getDeviceEventEmitter = (): DeviceEvent => {
  const deviceEventEmitter = new DeviceEventEmitter()

  deviceEventEmitter.on('connected', (data) =>
    console.log(
      'device is connected - TODO: handle it!!!',
      JSON.stringify(data)
    )
  )

  deviceEventEmitter.on('disconnected', (data) =>
    console.log(
      'device is disconnected - TODO: handle it!!!',
      JSON.stringify(data)
    )
  )

  return deviceEventEmitter
}

export default getDeviceEventEmitter
