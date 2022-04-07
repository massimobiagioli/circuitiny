import * as Device from '../../domain/Device'
import DeviceMongooseModel from './DeviceMongooseModel'

export const store = async (event: Device.Device): Promise<void> => {
  const model = new DeviceMongooseModel(event)
  await model.save()
}

export const remove = async (id: string): Promise<void> => {
  await DeviceMongooseModel.deleteOne({ id })
}

export const findAll = async (): Promise<Device.Device[]> => {
  const result = await DeviceMongooseModel.find()
  return result.map(Device.fromPrimitive)
}
