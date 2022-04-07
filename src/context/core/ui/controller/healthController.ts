import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions
} from 'fastify'

const healthController: FastifyPluginAsync = async (
  server: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  server.get('/', async (_request, _reply) => 'health ok!')
}

export default healthController
