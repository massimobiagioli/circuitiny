import fastify from 'fastify'
import fastifyStatic from 'fastify-static'
import path from 'path'
import healthRoutes from './routes/health'
import * as mqtt from 'mqtt'
import * as deps from './config/deps'
import { container } from './config/deps'
import { connect } from 'mongoose'
import { HandleDeviceEventRequest } from './context/device/application/HandleDeviceEventUseCase'
import * as O from 'fp-ts/lib/Option'
import { MqttConf } from './config/mqtt'
import { MongoConf } from './config/mongo'
import { ServerConf } from './config/server'
import { Logger } from 'pino'
import { UseCase } from './context/core/domain/UseCase'

const logger = container.resolve<Logger>(deps.KEYS.LOGGER)
const mqttConf = container.resolve<MqttConf>(deps.KEYS.MQTT_CONF)
const mongoConf = container.resolve<MongoConf>(deps.KEYS.MONGO_CONF)
const serverConf = container.resolve<ServerConf>(deps.KEYS.SERVER_CONF)

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
    const handleDeviceEventUseCase = container.resolve<
      UseCase<HandleDeviceEventRequest, void>
    >(deps.KEYS.HANDLE_DEVICE_EVENT_USE_CASE)
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

export const boot = () => {
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

  app.listen(serverConf.port(), (err, _address) => {
    if (err) {
      app.log.error(err)
      process.exit(1)
    }
  })
}
