import * as deps from '../../src/config/deps'
import devices from '../fixtures/devices'

export const load = async () => {
  const storeDeviceUseCase = deps.container.resolve(
    deps.keys.storeDeviceUseCase
  )
  devices.forEach(async (device) => {
    await storeDeviceUseCase({ device })
  })
}
