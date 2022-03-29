import DeviceEvent from '../../domain/DeviceEvent'
import DeviceEventRepository from '../../domain/DeviceEventRepository'
import DeviceEventMongooseModel from './DeviceEventMongooseModel'

class DeviceEventRepositoryMongooseImpl implements DeviceEventRepository {
  async store(event: DeviceEvent): Promise<void> {
    const model = new DeviceEventMongooseModel(event)
    await model.save()
  }
}

export default DeviceEventRepositoryMongooseImpl
