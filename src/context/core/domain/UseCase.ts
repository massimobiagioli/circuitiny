export type UseCase<Request, Response> = (
  request?: Request
) => Response | Promise<Response>
