import Axios from "axios";
import { API_ENDPOINT, HEADERS } from "./Constants";
import { errorHandler, successHandler } from "./RequestHandler";

export const getDetails = async () => {
  try {
    const res = await Axios.get(
      `${API_ENDPOINT}/manufacturer`,
      HEADERS(window.localStorage.getItem("x-access-token"))
    );
    return res.data;
  } catch (error) {
    console.log(JSON.stringify(error));
    errorHandler(error);
  }
};
export const getProductDetails = async brandId => {
  try {
    const res = await Axios.get(
      `${API_ENDPOINT}/productsbybrand/${brandId}`,
      HEADERS(window.localStorage.getItem("x-access-token"))
    );
    return res.data;
  } catch (error) {
    errorHandler(error);
  }
};
export const addProduct = async (formData, headerParam) => {
  const res = await Axios.post(
    `${API_ENDPOINT}/product`,
    formData,{
      headers:{
       ...HEADERS(window.localStorage.getItem("x-access-token")).headers,
       ...headerParam
      }
    }
    
  );
  return res;
};
