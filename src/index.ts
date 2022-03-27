import 'dotenv/config'
import fastify from 'fastify'
import pino from 'pino'
import * as server from './config/server'
import healthRoutes from './routes/health'

const app = fastify({
  logger: pino({ level: 'info' })
})

const serverConfig = server.getConfig()

app.register(healthRoutes, { prefix: '/health' })

app.listen(serverConfig.port, (err, _address) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
