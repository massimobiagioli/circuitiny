import { MongoMemoryServer } from 'mongodb-memory-server'
import * as App from '../../src/app'
import { connect, disconnect, connection } from 'mongoose'
import * as Fixtures from './Fixtures'

let mongoServer: MongoMemoryServer
const app = App.create()

export const up = async () => {
  mongoServer = await MongoMemoryServer.create()
  await connect(mongoServer.getUri())
  Fixtures.load()
}

export const down = async () => {
  await connection.db.dropDatabase()
  await disconnect()
  await mongoServer.stop()
}

export default app
