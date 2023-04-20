import axios, { AxiosResponse } from "axios";
import { LoginResult } from "../models/users/loginResult";
import { LoginRequest } from "../models/users/loginRequest";

const loadEnvVars = async () => {
  return await window.API.getEnvVariables();
};

// NOTE: It takes a little time to load the environment variables from electron process.
// This might cause bugs, for example  if I immediatelly try to login the user when he is using `Remember me`
loadEnvVars().then((envVars) => {
  axios.defaults.baseURL = envVars.apiUrl;
});

const responseBody = (response: AxiosResponse) => {
  return response.data;
};

const requests = {
  get: (url: string, params?: URLSearchParams) =>
    axios.get(url, { params: params }).then(responseBody),
  post: (url: string, body: any) => axios.post(url, body).then(responseBody),
  put: (url: string, body: any) => axios.put(url, body).then(responseBody),
  delete: (url: string) => axios.delete(url).then(responseBody),
  patch: (url: string, body?: any) => axios.patch(url, body).then(responseBody),
};

const Users = {
  login: (loginRequest: LoginRequest): Promise<LoginResult> =>
    requests.post("/auth/login", loginRequest),
};

export default {
  Users,
};
