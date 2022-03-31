import { model, Schema } from 'mongoose'

interface DeviceDocument {
  id: string
  model: string
  address: string
  sketch: string
}

interface DeviceEventDocument {
  eventType: string
  sender: DeviceDocument
  createdAt: number
  metadata: [Map<string, unknown>]
}

const deviceSchema = new Schema<DeviceDocument>({
  id: { type: String, required: true },
  model: { type: String, required: true },
  address: { type: String, required: true },
  sketch: { type: String, required: true }
})

const deviceEventSchema = new Schema<DeviceEventDocument>({
  eventType: { type: String, required: true },
  sender: { type: deviceSchema, required: true },
  createdAt: { type: Number, required: true },
  metadata: [
    {
      type: Map,
      of: Schema.Types.Mixed
    }
  ]
})

const DeviceEventMongooseModel = model<DeviceEventDocument>(
  'device_event',
  deviceEventSchema
)

export default DeviceEventMongooseModel
