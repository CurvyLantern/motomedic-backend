import { clientEnv } from "@/env/clientEnv";
import Axios from "axios";
const getBaseUrl = (prefixs: string[]) =>
  new URL(prefixs.join("/"), clientEnv.baseUrl);

const client = Axios.create({
  baseURL: getBaseUrl([""]).href,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  withCredentials: true,
});

// client.interceptors.response.use(
//   (res) => res,
//   (error) => {
//     throw error.response;
//   }
// );

const axiosClient = {
  get base() {
    client.defaults.baseURL = getBaseUrl([""]).href;
    return client;
  },
  v1: {
    get api() {
      client.defaults.baseURL = getBaseUrl([clientEnv.prefix.api, "v1"]).href;
      return client;
    },
    get web() {
      client.defaults.baseURL = getBaseUrl([clientEnv.prefix.web, "v1"]).href;
      return client;
    },
  },
  v2: {},
};

export default axiosClient;
