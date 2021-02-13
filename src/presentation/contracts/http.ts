export type Request<S = any, H =any> = {
  body?: S,
  headers?: H
}

export type Response<R = any> = {
  statusCode: number,
  body?: R
}
