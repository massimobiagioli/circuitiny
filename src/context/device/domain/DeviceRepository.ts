import { Device } from './Device'

export default interface DeviceRepository {
  store: (device: Device) => Promise<void>
  remove: (id: string) => Promise<void>
  findAll: () => Promise<Device[]>
}
