export interface Request<S = any, H =any> {
  body?: S,
  headers?: H
}

export interface Response<R = any>{
  statusCode: number,
  body?: R
}
