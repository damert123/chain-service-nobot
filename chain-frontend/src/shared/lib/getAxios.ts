import { API_HOST } from "../config";

import axios from "axios";

export function getAxios() {
  return axios.create({
    baseURL: API_HOST,
  });
}
