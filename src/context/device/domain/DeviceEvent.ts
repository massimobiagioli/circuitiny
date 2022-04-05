import { Static, Type } from '@sinclair/typebox'
import * as E from 'fp-ts/lib/Either'
import * as V from '../../core/domain/Validation'

export enum DeviceEventType {
  'connected' = 'connected',
  'disconnected' = 'disconnected'
}

export const DeviceEvent = Type.Object({
  eventType: Type.Enum(DeviceEventType),
  sender: Type.Object({
    id: Type.String(),
    model: Type.String(),
    address: Type.String({ format: 'ipv4' }),
    sketch: Type.String()
  }),
  createdAt: Type.Integer(),
  metadata: Type.Optional(
    Type.Array(Type.Record(Type.String(), Type.Unknown()))
  )
})

export type DeviceEvent = Static<typeof DeviceEvent>

const validate = V.compiler.compile(DeviceEvent)

const parseRaw = (raw: string): unknown => {
  try {
    return JSON.parse(raw)
  } catch {
    return undefined
  }
}

export const fromString = (raw: string): E.Either<Error, DeviceEvent> => {
  const data = parseRaw(raw)
  if (data === undefined) {
    return E.left(new Error('malformed input data'))
  }
  if (validate(data)) {
    return E.right(data as DeviceEvent)
  }
  return E.left(new Error(V.errorString(validate.errors)))
}
