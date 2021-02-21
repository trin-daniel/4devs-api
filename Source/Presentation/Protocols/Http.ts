export type Request<S = any, H = any, P = any> = {
  body?: S,
  headers?: H,
  params?: P,
  account_id?: string
}

export type Response<R = any> = {
  statusCode: number,
  body?: R
}
