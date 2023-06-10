import axios from "axios";

export const api = axios.create({
  baseURL: "https://stingray-app-3hd6p.ondigitalocean.app/",
  withCredentials: true,
});
