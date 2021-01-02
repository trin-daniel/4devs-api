export class SignupController {
  handle (request: any): any {
    return {
      statusCode: 400,
      body: new Error()
    }
  }
}
