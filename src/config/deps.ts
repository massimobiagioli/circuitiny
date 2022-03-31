import 'reflect-metadata'
import { container } from 'tsyringe'
import { Logger } from 'pino'
import DeviceEventRepositoryMongooseImpl from '../context/device/infrastructure/mongoose/DeviceEventRepositoryMongooseImpl'

export function init(logger: Logger) {
  container.register('DeviceEventRepository', {
    useClass: DeviceEventRepositoryMongooseImpl
  })
  container.register('Logger', {
    useValue: logger
  })
}
