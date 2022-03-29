import DeviceEvent from './DeviceEvent'

interface DeviceRepository {
  store(event: DeviceEvent): void
}

export default DeviceRepository
