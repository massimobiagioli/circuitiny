import 'dotenv/config'
import fastify, { FastifyInstance } from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import pino from 'pino'
import healthRoutes from './routes/health'
import * as mqtt from 'mqtt'
import * as ServerConfig from './config/server'
import * as MqttConfig from './config/mqtt'
import * as MongoDbConfig from './config/mongo'
import * as deps from './config/deps'
import { container } from 'tsyringe'
import { connect } from 'mongoose'
import HandleDeviceEventUseCase from './context/device/application/HandleDeviceEventUseCase'
import * as O from 'fp-ts/lib/Option'

const logger = pino({ level: 'info' })

const initMqtt = () => {
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
    const device = topic.split('/')[1]
    const handleDeviceEventUseCase = container.resolve(HandleDeviceEventUseCase)
    handleDeviceEventUseCase.invoke({ device, rawEvent: message.toString() })
  })
}

const startDbConnection = (): void => {
  if (O.isNone(MongoDbConfig.url())) {
    logger.error('No mongo url provided')
    return
  }
  const getUrl = O.getOrElse(() => '')
  const url = getUrl(MongoDbConfig.url())
  connect(url)
    .then(() => {
      logger.info('Connected to mongodb')
    })
    .catch((err) => {
      logger.error(err)
    })
}

export const create = (): FastifyInstance => {
  deps.init(logger)
  initMqtt()
  startDbConnection()

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
