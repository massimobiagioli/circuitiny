export default interface UseCase<Request, Response> {
  invoke(request?: Request): Response | Promise<Response>
}
