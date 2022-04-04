import Axios from 'axios';
import { API_ENDPOINT } from './Constants';


export default class User {
  login = async (formData) => {
    const res = await Axios.post(`${API_ENDPOINT}/users/login`, formData, {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
    });
    return res;
  }
  register = async (formData) => {
    const res = await Axios.post(`${API_ENDPOINT}/users/register`, formData, {
      headers: { 'content-type': 'application/json', 'cache-control': 'no-cache' },
    });
    return res;
  }
}
