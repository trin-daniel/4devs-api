export interface Validation {
  Validate (input: {[key: string]: any}): Error | null
}
