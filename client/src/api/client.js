import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const client = axios.create({
  baseURL: API, // ✅ base URL set here ONLY
  timeout: 15000, // prevents infinite hanging
});

// auto retry once for cold start
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;

    if (!config || config.__retry) {
      return Promise.reject(error);
    }

    config.__retry = true;

    // wait for server wakeup
    await sleep(4000);

    return client(config);
  },
);

export default client;
