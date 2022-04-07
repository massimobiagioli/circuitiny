import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions
} from 'fastify'
import DeviceRepository from '../../domain/DeviceRepository'

const getDeviceController =
  (deviceRepository: DeviceRepository): FastifyPluginAsync =>
  async (server: FastifyInstance, _options: FastifyPluginOptions) => {
    server.get('/', async (_request, _reply) => deviceRepository.findAll())
  }

export default getDeviceController
