
export default class BaseApi {

  constructor (baseUrl, headers = {}) {
    this.baseUrl = baseUrl
    this.headers = headers
  }

  fetch = async (endpoint, options = {}) => {
    options.headers = this.headers
    try {
      return await fetch(this.baseUrl + endpoint, options)
    } catch (e) {
      console.error(e)
    }
  }
}
