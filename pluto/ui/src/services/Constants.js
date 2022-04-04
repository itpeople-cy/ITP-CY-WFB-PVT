// export const API_ENDPOINT = 'http://192.168.5.62:3000';
export const API_ENDPOINT =
  "http://ec2-3-81-107-94.compute-1.amazonaws.com:3000";
export const HEADERS = accessToken => ({
  headers: {
    "content-type": "application/json",
    "cache-control": "no-cache",
    "x-access-token": accessToken
  }
});
