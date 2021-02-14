export type Request<S = any, H = any, P = any> = {
  body?: S,
  headers?: H,
  params?: P
}

export type Response<R = any> = {
  statusCode: number,
  body?: R
}
