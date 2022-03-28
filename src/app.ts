import 'dotenv/config'
import fastify, { FastifyInstance } from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import pino, { Logger } from 'pino'
import healthRoutes from './routes/health'
import * as mqtt from 'mqtt'
import * as ServerConfig from './config/server'
import * as MqttConfig from './config/mqtt'

const initMqtt = (logger: Logger) => {
  const mqttClient: mqtt.MqttClient = mqtt.connect(MqttConfig.brokerUrl())

  mqttClient.on('connect', () => {
    logger.info('Connected to broker: raspyprod')
    mqttClient.subscribe('device/#', (err) => {
      if (err) {
        logger.info('Error subscribing to topic: devices/#')
      } else {
        logger.info('Subscribed to topic: devices/#')
      }
    })
  })

  mqttClient.on('message', (topic, message) => {
    logger.info(`Topic: ${topic}\nMessage: ${message}`)
    const device = topic.split('/')[1]
    mqttClient.publish(`to-device/${device}`, 'ack')
    logger.info(`Sent ack to ${device}`)
  })
}

export const create = (): FastifyInstance => {
  const logger = pino({ level: 'info' })

  initMqtt(logger)

  const app = fastify({
    logger: logger
  })

  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../client/dist'),
    prefix: '/'
  })
  app.register(healthRoutes, { prefix: '/health' })

  return app
}

export const start = (app: FastifyInstance) => {
  app.listen(ServerConfig.port(), (err, _address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}
