import axios from "axios";

const baseBackendUrl = "http://127.0.0.1:8080";

const API = axios.create({ baseURL: baseBackendUrl });

export { baseBackendUrl, API };