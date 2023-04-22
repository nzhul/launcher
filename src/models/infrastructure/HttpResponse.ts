export interface HttpResponse<T> {
  status: number;
  data: T;
  error: RestErrorWrapper;
  isSuccess: boolean;
}

export interface RestErrorWrapper {
  error: RestError;
}

export interface RestError {
  code: string;
  target: string;
  message: string;
  details: RestError[];
}
