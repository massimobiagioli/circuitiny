export const DEVICES = {
  ESP8266_01: 'esp8266-01'
}

export const RAW_MESSAGES = {
  CONNECTED: `{"sender": {"id": "esp8266-01", "sketch": "dummy", "model": "ESP8266", "address": "192.168.1.37"}, "createdAt": 702293518, "eventType": "connected"}`,
  DISCONNECTED: `{"sender": {"id": "esp8266-01", "sketch": "dummy", "model": "ESP8266", "address": "192.168.1.37"}, "createdAt": 702293518, "eventType": "disconnected"}`,
  WITH_VALIDATION_ERROR: `{"sender": {"id": "esp8266-01", "sketch": "dummy", "model": "ESP8266", "address": "asdf"}, "createdAt": 702293518, "eventType": "connected"}`
}

export const FAKE_DEVICES = [
  {
    id: '1',
    model: 'device1',
    address: '10.10.10.1',
    sketch: 'test sketch 1'
  },
  {
    id: '2',
    model: 'device2',
    address: '10.10.10.2',
    sketch: 'test sketch 2'
  }
]
