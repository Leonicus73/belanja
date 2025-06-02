import axios from "axios";

const isProduction = import.meta.env.PROD;

function fetchToken() {
  const url = isProduction
    ? "/api/onemap/auth/post/getToken"
    : "/oneMapProxy/api/auth/post/getToken";
  return axios.create({
    baseURL: url,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export default fetchToken;
