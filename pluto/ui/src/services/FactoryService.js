import Axios from 'axios';
import { API_ENDPOINT, HEADERS } from './Constants';
import { errorHandler, successHandler } from './RequestHandler';

  export const getDetails = async () => {
    try {
      const res = await Axios.get(`${API_ENDPOINT}/factory`, HEADERS(window.localStorage.getItem('x-access-token')));
      return res.data;
    } catch (error) {
      errorHandler(error);
    }
  }
  export const getUntaggedProducts = async (brand) => {
    try {
      const res = await Axios.get(`${API_ENDPOINT}/untaggedproducts/${brand}`, HEADERS(window.localStorage.getItem('x-access-token')));
      return res.data;
    } catch (error) {
      errorHandler(error);
    }
  }
  export const getScans = async (productID) => {
    try {
      const payload={
        tagID:"",
        productID:productID
      };
      const res = await Axios.post(`${API_ENDPOINT}/scanbyid`, payload, HEADERS(window.localStorage.getItem('x-access-token')));
      return res.data;
    } catch (error) {
      errorHandler(error);
    }
  }
  export const getUnassignedTags = async (tech) => {
    try {
      const res = await Axios.get(`${API_ENDPOINT}/unassignedtags/${tech}`, HEADERS(window.localStorage.getItem('x-access-token')));
      return res.data;
    } catch (error) {
      errorHandler(error);
    }
  }
  export const getUnshippedProducts = async () => {
    try {
      const res = await Axios.get(`${API_ENDPOINT}/unshippedproducts`, HEADERS(window.localStorage.getItem('x-access-token')));
      return res.data;
    } catch (error) {
      errorHandler(error);
    }
  }
  export const assignTag = async (payload) => {
    try {
      const res = await Axios.post(`${API_ENDPOINT}/tag`,payload, HEADERS(window.localStorage.getItem('x-access-token')));
      return res.data;
    } catch (error) {
      errorHandler(error);
    }
  }
  export const shipProduct = async (payload) => {
    try {
      const res = await Axios.put(`${API_ENDPOINT}/product`,payload, HEADERS(window.localStorage.getItem('x-access-token')));
      return res.data;
    } catch (error) {
      errorHandler(error);
    }
  }