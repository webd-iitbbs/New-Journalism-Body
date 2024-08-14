import axios from "axios";

const baseBackendUrl = "http://127.0.0.1:8080";
// const baseBackendUrl = "https://48bfw833-8080.inc1.devtunnels.ms";

const API = axios.create({ baseURL: baseBackendUrl });

export { baseBackendUrl, API };
