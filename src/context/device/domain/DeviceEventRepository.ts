import { DeviceEvent } from './DeviceEvent'

export default interface DeviceRepository {
  store(event: DeviceEvent): void
}
