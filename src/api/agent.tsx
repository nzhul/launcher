/* eslint-disable @typescript-eslint/no-non-null-assertion */
import axios, { AxiosError, AxiosResponse } from 'axios';
import { toast } from 'react-toastify';
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

axios.interceptors.request.use(
  function (config) {
    const token = window.localStorage.getItem('jwt');

    if (token) {
      config.headers!.Authorization = 'Bearer ' + token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

//dido: change ms = 2000 if you want to fake API delay when developing locally
function sleep(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

axios.interceptors.response.use(async (response) => {
  // add artificial delay for dev env
  if (process.env.NODE_ENV === 'development') {
    await sleep();
  }
  return response;
});

axios.interceptors.response.use(undefined, async (error) => {
  if (error.message === 'Network Error' && !error.response) {
    toast.error('Network error - unable to connect to API!');
  }

  throw error.response;
});

const responseBody = (response: AxiosResponse) => {
  return {
    data: response.data,
    status: response.status,
    isSuccess: response.status >= 200 && response.status <= 299,
  } as HttpResponse<any>;
};

const handleError = (error: AxiosError) => {
  if (!error) {
    return {
      data: undefined,
      status: 500,
      isSuccess: false,
      error: {
        error: {
          message: 'Server error!',
        },
      },
    } as unknown as HttpResponse<any>;
  }

  return {
    data: undefined,
    status: error.status,
    isSuccess: error.status >= 200 && error.status <= 299,
    error: (error as any).data,
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
