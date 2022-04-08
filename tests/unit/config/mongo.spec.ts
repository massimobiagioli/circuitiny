import * as O from 'fp-ts/lib/Option'
import * as mongo from '../../../src/config/mongo'

describe('MongoConfig', () => {
  const env = Object.assign({}, process.env)

  afterAll(() => {
    process.env = env
  })

  it('should return connection url', () => {
    process.env.MONGO_DB_URL = 'mongohost:27017'
    const maybeUrl = mongo.url()
    const getUrl = O.getOrElse(() => '')
    const url = getUrl(maybeUrl)

    expect(O.isSome(maybeUrl)).toBeTruthy()
    expect(url).toBe('mongohost:27017')
  })

  it('should return none', () => {
    delete process.env.MONGO_DB_URL
    const maybeUrl = mongo.url()

    expect(O.isNone(maybeUrl)).toBeTruthy()
  })
})
