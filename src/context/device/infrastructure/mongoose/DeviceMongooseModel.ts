import { model, Schema } from 'mongoose'

export interface DeviceDocument {
  id: string
  model: string
  address: string
  sketch: string
}

const deviceSchema = new Schema<DeviceDocument>({
  id: { type: String, required: true },
  model: { type: String, required: true },
  address: { type: String, required: true },
  sketch: { type: String, required: true }
})

const DeviceMongooseModel = model<DeviceDocument>('device', deviceSchema)

export default DeviceMongooseModel
