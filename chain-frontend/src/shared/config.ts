import { getEnvVar } from "./lib/getEnvVar";

export const SERVER_HOST = getEnvVar("VITE_SERVER_HOST");

export const IS_SSL = window.location.protocol === "https:";
export const API_HOST = `${IS_SSL ? "https://" : "http://"}${SERVER_HOST}/api`;
