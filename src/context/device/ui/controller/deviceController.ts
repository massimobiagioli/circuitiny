import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions
} from 'fastify'
import { UseCase } from '../../../core/domain/UseCase'
import { Device } from '../../domain/Device'

const getDeviceController =
  (
    findAllDevicesUseCase: UseCase<never, Promise<Device[]>>
  ): FastifyPluginAsync =>
  async (server: FastifyInstance, _options: FastifyPluginOptions) => {
    server.get('/', async (_request, _reply) => findAllDevicesUseCase())
  }

export default getDeviceController
