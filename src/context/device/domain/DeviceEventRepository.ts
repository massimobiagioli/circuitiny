import { DeviceEvent } from './DeviceEvent'

export default interface DeviceEventRepository {
  store: (event: DeviceEvent) => Promise<void>
}
