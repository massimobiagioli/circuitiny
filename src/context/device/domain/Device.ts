import { Static, Type } from '@sinclair/typebox'
import * as E from 'fp-ts/lib/Either'
import * as V from '../../core/domain/Validation'
import { DeviceDocument } from '../infrastructure/mongoose/DeviceMongooseModel'
import { DeviceConnectedEvent } from './DeviceEventEmitter'

export const Device = Type.Object({
  id: Type.String(),
  model: Type.String(),
  address: Type.String({ format: 'ipv4' }),
  sketch: Type.String()
})

export type Device = Static<typeof Device>

const validate = V.compiler.compile(Device)

export const fromConnectedEvent = (
  event: DeviceConnectedEvent
): E.Either<Error, Device> => {
  if (validate(event)) {
    return E.right(event as Device)
  }
  return E.left(new Error(V.errorString(validate.errors)))
}

export const fromPrimitive = (primitive: DeviceDocument): Device => {
  return {
    id: primitive.id,
    model: primitive.model,
    address: primitive.address,
    sketch: primitive.sketch
  }
}
