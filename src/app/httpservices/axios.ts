import axios from "axios";
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
export const loginOneApi = axios.create({
  baseURL: `${apiUrl}/api`,

});

export const usersBaseEndpoint = "/users";
