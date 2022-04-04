import { Constants } from 'expo'

import fakeData from './fakeData'
import ChaincodeApi from '../ChaincodeApi'
import type {
  AssignTagToProduct,
  AuthenticateTag,
  CertificateVerification,
  CreateTransaction,
  RecordScan
} from './types'

const getBaseUrl = () => {
  switch (Constants.manifest.releaseChannel) {
    case 'staging': return Constants.manifest.extra.staging.counterfeitApiUrl

    // if there's no releaseChannel, assume it's a dev environment and use the expo host machine
    default: return 'http://ec2-3-81-107-94.compute-1.amazonaws.com:3000'
      // `http://${Constants.manifest.debuggerHost.split(`:`).shift()}:3000`

  }
}

export default class CounterfeitApi extends ChaincodeApi {

  constructor (token) {
    super(getBaseUrl(), { 'x-access-token': token })
  }

  login = async (body: { email: string, password: string }) => {
    try {
      const response = await this.post('/users/login', body)
      return response.accessToken
    } catch (e) {}
    return false
  }

  getTagDetails = async (hash) => {
    try {
      const response = await this.get('/scantag/' + hash)
      console.log('scan tag details')
      console.log(JSON.parse(response.objectBytes))
      return { ...JSON.parse(response.objectBytes), isVerified: response.status === 'SUCCESS' }
    } catch (e) {}
    return fakeData.productDetails
  }

  getProductDetails = async (productId) => {
    try {
      const response = await this.get('/scanproductcode/' + productId)
      // console.log(response.objectBytes)
      return JSON.parse(response.objectBytes)
    } catch (e) {}
    return fakeData.productDetails
  }

  getProductForSale = async (productId) => {
    try {
      const response = await this.get('/salescantag/' + productId)
      console.log(response)
      if (response.objectBytes) {
        return JSON.parse(response.objectBytes)
      }
      return response
    } catch (e) {}
    return fakeData.productDetails
  }

  authenticateTag = async (data: AuthenticateTag) => {
    console.log(data)
    try {
      const response = await this.post('/authenticatetag', data)
      console.log(response)
      return JSON.parse(response.objectBytes).isAuthentic
    } catch (e) {
      console.log(e)
    }
    return false
  }

  sendEmailVerification = async (email) => {
    this.post('/email', { email })
      .catch((e) => {
        console.log(e)
      })
  }

  verifyEmail = async (email, activationCode) => {
    try {
      const response = await this.put('/verifyemail', { email, activationCode })
      console.log(response)
      return response.result.indexOf(' success') !== -1
    } catch (e) {
      console.log(e)
    }
    return false
  }

  createTransaction = async (transaction: CreateTransaction) => {
    try {
      console.log(transaction)
      const response = await this.post('/transaction', transaction)
      console.log(response)
      return JSON.parse(response.objectBytes)
    } catch (e) {
      console.log(e)
    }
    return fakeData.transaction
  }

  verifyCertificate = async (data: CertificateVerification) => {
    try {
      const response = await this.post('/verifycert', data)
      console.log(response)
      return JSON.parse(response.objectBytes).isAuthentic
    } catch (e) {
      console.log(e)
    }
    return false
  }

  getRetailerList = async () => {
    try {
      const response = await this.get('/retailerlist')
      console.log(JSON.parse(response.objectBytes))
      return JSON.parse(response.objectBytes)
    } catch (e) {
      console.log(e)
    }
    return []
  }

  assignTagToProduct = async (data: AssignTagToProduct) => {
    console.log(data)
    try {
      let response = await this.post('/assigntagtoproduct', data)
      console.log(response)
      if (!response.objectBytes) {
        // TODO: ask backend to fix the response structure
        return { errorMessage: "There was an issue assigning the tag with the product." }
      }
      return JSON.parse(response.objectBytes)
    } catch (e) {
      console.log(e)
    }
    return false
  }

  recordScan = async (data: RecordScan) => {
    console.log(data)
    try {
      const response = await this.post('/scan', data)
      console.log(JSON.parse(response.objectBytes))
      return JSON.parse(response.objectBytes)
    } catch (e) {
      console.log(e)
    }
    return false
  }
}
