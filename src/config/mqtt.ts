const DEFAULT_BROKER_URL = 'mqtt://localhost'

export const brokerUrl = (): string =>
  process.env.MQTT_BROKER_URL ?? DEFAULT_BROKER_URL
