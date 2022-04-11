import { MongoMemoryServer } from 'mongodb-memory-server'
import * as App from '../../src/app'
import { connect, disconnect, connection } from 'mongoose'

let mongoServer: MongoMemoryServer
const app = App.create()

export const up = async () => {
  mongoServer = await MongoMemoryServer.create()
  await connect(mongoServer.getUri())
}

export const down = async () => {
  await connection.db.dropDatabase()
  await disconnect()
  await mongoServer.stop()
}

export default app
