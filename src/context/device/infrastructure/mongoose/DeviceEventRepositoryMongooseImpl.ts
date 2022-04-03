import { DeviceEvent } from '../../domain/DeviceEvent'
import DeviceEventMongooseModel from './DeviceEventMongooseModel'

export const store = async (event: DeviceEvent): Promise<void> => {
  const model = new DeviceEventMongooseModel(event)
  await model.save()
}
