import 'reflect-metadata'
import { container, DependencyContainer, InjectionToken } from 'tsyringe'
import pino, { Logger } from 'pino'
import * as mqtt from './mqtt'
import * as mongo from './mongo'
import * as server from './server'
import HandleDeviceEventUseCase, {
  HandleDeviceEventRequest
} from '../context/device/application/HandleDeviceEventUseCase'
import DeviceEventRepository from '../context/device/domain/DeviceEventRepository'
import * as DeviceEventRepositoryMongooseImpl from '../context/device/infrastructure/mongoose/DeviceEventRepositoryMongooseImpl'
import * as DeviceRepositoryMongooseImpl from '../context/device/infrastructure/mongoose/DeviceRepositoryMongooseImpl'

import { UseCase } from '../context/core/domain/UseCase'
import getDeviceEventEmitter, {
  DeviceEvent
} from '../context/device/domain/DeviceEventEmitter'
import DeviceRepository from '../context/device/domain/DeviceRepository'
import { FastifyPluginAsync } from 'fastify'
import getDeviceController from '../context/device/ui/controller/DeviceController'
import StoreDeviceUseCase, {
  StoreDeviceRequest
} from '../context/device/application/StoreDeviceUseCase'
import RemoveDeviceUseCase, {
  RemoveDeviceRequest
} from '../context/device/application/RemoveDeviceUseCase'
import { Device } from '../context/device/domain/Device'
import FindAllDevicesEventUseCase from '../context/device/application/FindAllDevicesUseCase'

export const keys = {
  logger: Symbol('logger') as InjectionToken<Logger>,
  mqttConf: Symbol('mqttConf') as InjectionToken<mqtt.MqttConf>,
  mongoConf: Symbol('mongoConf') as InjectionToken<mongo.MongoConf>,
  serverConf: Symbol('serverConf') as InjectionToken<server.ServerConf>,
  deviceEventRepository: Symbol(
    'DeviceEventRepository'
  ) as InjectionToken<DeviceEventRepository>,
  deviceRepository: Symbol(
    'DeviceRepository'
  ) as InjectionToken<DeviceRepository>,
  handleDeviceEventUseCase: Symbol(
    'HandleDeviceEventUseCase'
  ) as InjectionToken<UseCase<HandleDeviceEventRequest, void>>,
  storeDeviceUseCase: Symbol('StoreDeviceUseCase') as InjectionToken<
    UseCase<StoreDeviceRequest, void>
  >,
  removeDeviceUseCase: Symbol('RemoveDeviceUseCase') as InjectionToken<
    UseCase<RemoveDeviceRequest, void>
  >,
  findAllDevicesUseCase: Symbol('FindAllDevicesUseCase') as InjectionToken<
    UseCase<never, Promise<Device[]>>
  >,
  deviceEventEmitter: Symbol(
    'DeviceEventEmitter'
  ) as InjectionToken<DeviceEvent>,
  deviceController: Symbol(
    'DeviceController'
  ) as InjectionToken<FastifyPluginAsync>
}

container.register(keys.logger, {
  useValue: pino({ level: 'info' })
})

container.register(keys.mqttConf, {
  useValue: mqtt
})

container.register(keys.mongoConf, {
  useValue: mongo
})

container.register(keys.serverConf, {
  useValue: server
})

container.register(keys.deviceEventRepository, {
  useFactory: (_) => DeviceEventRepositoryMongooseImpl
})

container.register(keys.deviceRepository, {
  useFactory: (_) => DeviceRepositoryMongooseImpl
})

container.register(keys.handleDeviceEventUseCase, {
  useFactory: (container: DependencyContainer) => {
    const deviceEventRepository = container.resolve(keys.deviceEventRepository)
    const logger = container.resolve(keys.logger)
    const emitter = container.resolve(keys.deviceEventEmitter)
    return HandleDeviceEventUseCase(deviceEventRepository, logger, emitter)
  }
})

container.register(keys.storeDeviceUseCase, {
  useFactory: (container: DependencyContainer) => {
    const deviceRepository = container.resolve(keys.deviceRepository)
    const logger = container.resolve(keys.logger)
    return StoreDeviceUseCase(deviceRepository, logger)
  }
})

container.register(keys.removeDeviceUseCase, {
  useFactory: (container: DependencyContainer) => {
    const deviceRepository = container.resolve(keys.deviceRepository)
    const logger = container.resolve(keys.logger)
    return RemoveDeviceUseCase(deviceRepository, logger)
  }
})

container.register(keys.findAllDevicesUseCase, {
  useFactory: (container: DependencyContainer) => {
    const deviceRepository = container.resolve(keys.deviceRepository)
    return FindAllDevicesEventUseCase(deviceRepository)
  }
})

container.register(keys.deviceEventEmitter, {
  useFactory: (container: DependencyContainer) => {
    const storeDeviceUseCase = container.resolve(keys.storeDeviceUseCase)
    const removeDeviceUseCase = container.resolve(keys.removeDeviceUseCase)
    const logger = container.resolve(keys.logger)
    return getDeviceEventEmitter(
      storeDeviceUseCase,
      removeDeviceUseCase,
      logger
    )
  }
})

container.register(keys.deviceController, {
  useFactory: (container: DependencyContainer) => {
    const findAllDevicesUseCase = container.resolve(keys.findAllDevicesUseCase)
    return getDeviceController(findAllDevicesUseCase)
  }
})

export { container }
