export class ApiError extends Error {
  statusCode: number;
  data: any;
  message: string;
  errors: any[];
  success: boolean;

  constructor(
    statusCode: number,
    message: string = "something went wrong",
    errors = [],
    stack = ""
  ) {
    super();
    
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    
  }
  
}

