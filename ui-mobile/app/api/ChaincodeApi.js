import BaseApi from './BaseApi'

export default class ChaincodeApi extends BaseApi {

  constructor (baseUrl, headers) {
    headers['Content-Type'] = 'application/json'
    super(baseUrl, headers)
  }

  get = async (endpoint) => {
    console.log('GET ' + endpoint)
    const response = await this.fetch(endpoint)
    console.log('Success!')
    return response.json()
  }

  post = async (endpoint, body) => {
    console.log('POST ' + endpoint)
    const response = await this.fetch(endpoint, {
      method: 'POST',
      body: JSON.stringify(body)
    })

    console.log('Success!')
    const json = await response.json()
    return json
  }

  put = async (endpoint, body) => {
    console.log('PUT ' + endpoint)
    const response = await this.fetch(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body)
    })

    console.log('Success!')
    const json = await response.json()
    return json
  }
}
