import 'reflect-metadata'
import { container, DependencyContainer } from 'tsyringe'
import pino, { Logger } from 'pino'
import * as mqtt from './mqtt'
import * as mongo from './mongo'
import * as server from './server'
import HandleDeviceEventUseCase, {
  HandleDeviceEventRequest
} from '../context/device/application/HandleDeviceEventUseCase'
import DeviceEventRepository from '../context/device/domain/DeviceEventRepository'
import * as DeviceEventRepositoryMongooseImpl from '../context/device/infrastructure/mongoose/DeviceEventRepositoryMongooseImpl'

import { UseCase } from '../context/core/domain/UseCase'

export enum KEYS {
  LOGGER = 'LOGGER',

  MQTT_CONF = 'MQTT_CONF',
  MONGO_CONF = 'MONGO_CONF',
  SERVER_CONF = 'SERVER_CONF',

  DEVICE_EVENT_REPOSITORY = 'DEVICE_EVENT_REPOSITORY',

  HANDLE_DEVICE_EVENT_USE_CASE = 'HANDLE_DEVICE_EVENT_USE_CASE'
}

container.register<Logger>(KEYS.LOGGER, {
  useValue: pino({ level: 'info' })
})

container.register<mqtt.MqttConf>(KEYS.MQTT_CONF, {
  useValue: mqtt
})

container.register<mongo.MongoConf>(KEYS.MONGO_CONF, {
  useValue: mongo
})

container.register<server.ServerConf>(KEYS.SERVER_CONF, {
  useValue: server
})

container.register<DeviceEventRepository>(KEYS.DEVICE_EVENT_REPOSITORY, {
  useFactory: (_) => DeviceEventRepositoryMongooseImpl
})

container.register<UseCase<HandleDeviceEventRequest, void>>(
  KEYS.HANDLE_DEVICE_EVENT_USE_CASE,
  {
    useFactory: (container: DependencyContainer) => {
      const deviceEventRepository = container.resolve<DeviceEventRepository>(
        KEYS.DEVICE_EVENT_REPOSITORY
      )
      const logger = container.resolve<Logger>(KEYS.LOGGER)
      return HandleDeviceEventUseCase(deviceEventRepository, logger)
    }
  }
)

export { container }
