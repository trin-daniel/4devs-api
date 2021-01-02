export interface Request<S = any> {
  body: S
}

export interface Response<R = any>{
  statusCode: number,
  body?: R
}
