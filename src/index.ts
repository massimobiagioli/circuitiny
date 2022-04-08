import 'dotenv/config'
import { pipe } from 'fp-ts/lib/function'
import * as App from './app'

pipe(App.create(), App.start)
