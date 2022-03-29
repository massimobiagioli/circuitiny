import { Static, Type } from '@sinclair/typebox'
import * as E from 'fp-ts/lib/Either'
import * as V from '../../core/domain/Validation'

enum DeviceEventType {
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
  createdAt: Type.Integer()
})

export type DeviceEvent = Static<typeof DeviceEvent>

export const fromString = (raw: string): E.Either<Error, DeviceEvent> => {
  const validate = V.compiler.compile(DeviceEvent)
  const data = JSON.parse(raw)
  if (validate(data)) {
    return E.right(data as DeviceEvent)
  }

  return E.left(new Error(V.errorString(validate.errors)))
}
