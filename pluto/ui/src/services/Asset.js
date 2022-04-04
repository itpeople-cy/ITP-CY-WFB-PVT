import Axios from 'axios';
import { API_ENDPOINT, HEADERS } from './Constants';
import { errorHandler, successHandler } from './RequestHandler';

export default class Asset {
  getAssetSingle = async (assetName, assetKeysObject) => {
    let urlStringForSingleObject = '';
    Object.keys(assetKeysObject).map((key) => {
      urlStringForSingleObject += `/${assetKeysObject[key]}`;
      return true;
    });
    try {
      const res = await Axios.get(`${API_ENDPOINT}/${assetName.toLowerCase()}${urlStringForSingleObject}`, HEADERS(window.localStorage.getItem('access-token')));
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) { console.log(error); errorHandler(error); }
  }

  getAssetList = async (assetName) => {
    try {
      const res = await Axios.get(`${API_ENDPOINT}/${assetName.toLowerCase()}list`, HEADERS(window.localStorage.getItem('access-token')));
      if (res.status === 200) {
        return res.data;
      }
    } catch (error) { console.log(error); errorHandler(error); }
  }

  create = async (assetName, asset) => {
    try {
      console.log(asset);
      const res = await Axios.post(`${API_ENDPOINT}/${assetName.toLowerCase()}`, asset, HEADERS(window.localStorage.getItem('access-token')));
      if (res.status === 200) {
        successHandler(`Successfully created ${assetName}`);
        return res.data;
      }
    } catch (error) {
      console.log(JSON.stringify(error));
      errorHandler(error);
    }
  }
}
