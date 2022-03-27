import {
  FastifyInstance,
  FastifyPluginAsync,
  FastifyPluginOptions
} from 'fastify'

const HealthRoute: FastifyPluginAsync = async (
  server: FastifyInstance,
  _options: FastifyPluginOptions
) => {
  server.get('/', async (_request, _reply) => {
    return 'health ok!'
  })
}

export default HealthRoute
