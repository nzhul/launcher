import axios, { AxiosError, AxiosResponse } from 'axios';
import { LoginResult } from '../models/users/loginResult';
import { LoginRequest } from '../models/users/loginRequest';
import { RegisterRequest } from '../models/users/registerRequest';
import { HttpResponse } from '../models/infrastructure/HttpResponse';

const loadEnvVars = async () => {
  return await window.API.getEnvVariables();
};

// NOTE: It takes a little time to load the environment variables from electron process.
// This might cause bugs, for example  if I immediatelly try to login the user when he is using `Remember me`
loadEnvVars().then((envVars) => {
  axios.defaults.baseURL = envVars.apiUrl;
});

const responseBody = (response: AxiosResponse) => {
  return {
    data: response.data,
    status: response.status,
    isSuccess: response.status >= 200 && response.status <= 299,
  } as HttpResponse<any>;
};

const handleError = (error: AxiosError) => {
  return {
    data: undefined,
    status: error.response.status,
    isSuccess: error.status >= 200 && error.status <= 299,
    error: error.response.data,
  } as HttpResponse<any>;
};

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params: params }).then(responseBody),
  post: (url: string, body: any) =>
    axios.post(url, body).then(responseBody).catch(handleError),
  put: (url: string, body: any) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  patch: (url: string, body?: any) => axios.patch(url, body).then(responseBody),
};

const Users = {
  login: (loginRequest: LoginRequest): Promise<HttpResponse<LoginResult>> =>
    requests.post('/auth/login', loginRequest),
  register: (registerRequest: RegisterRequest): Promise<HttpResponse<void>> =>
    requests.post('/auth/register', registerRequest),
};

export default {
  Users,
};
