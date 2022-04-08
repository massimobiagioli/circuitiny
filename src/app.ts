import fastify, { FastifyInstance } from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import * as mqtt from 'mqtt'
import * as deps from './config/deps'
import { connect } from 'mongoose'
import * as O from 'fp-ts/lib/Option'
import healthController from './context/core/ui/controller/healthController'

const logger = deps.container.resolve(deps.keys.logger)
const mqttConf = deps.container.resolve(deps.keys.mqttConf)
const mongoConf = deps.container.resolve(deps.keys.mongoConf)
const serverConf = deps.container.resolve(deps.keys.serverConf)
const deviceController = deps.container.resolve(deps.keys.deviceController)

const initMqtt = () => {
  const mqttClient: mqtt.MqttClient = mqtt.connect(mqttConf.brokerUrl())

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

  mqttClient.on('message', async (topic, message) => {
    const device = topic.split('/')[1]
    const handleDeviceEventUseCase = deps.container.resolve(
      deps.keys.handleDeviceEventUseCase
    )
    await handleDeviceEventUseCase({ device, rawEvent: message.toString() })
  })
}

const startDbConnection = (): void => {
  if (O.isNone(mongoConf.url())) {
    logger.error('No mongo url provided')
    return
  }
  const getUrl = O.getOrElse(() => '')
  const url = getUrl(mongoConf.url())
  connect(url)
    .then(() => {
      logger.info('Connected to mongodb')
    })
    .catch((err) => {
      logger.error(err)
    })
}

const registerRoutes = (app: FastifyInstance) => {
  app.register(fastifyStatic, {
    root: path.resolve(__dirname, '../client/dist'),
    prefix: '/'
  })
  app.register(healthController, { prefix: '/health' })
  app.register(deviceController, { prefix: '/api/device' })
}

export const boot = () => {
  initMqtt()
  startDbConnection()

  const app = fastify({
    logger: logger
  })

  registerRoutes(app)

  app.listen(serverConf.port(), (err, _address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}
