import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const client = axios.create({
  baseURL: API,
  timeout: 15000, // prevents infinite hang
});

// retry once if server is waking up
client.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;

    // only retry once
    if (!config || config.__retry) {
      return Promise.reject(error);
    }

    config.__retry = true;

    // wait 4s for Render cold start
    await sleep(4000);

    return client(config);
  }
);

export default client;
