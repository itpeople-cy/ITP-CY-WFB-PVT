import { API_ENDPOINT } from './Constants';

export default class FabricNetwork {
  getUptime = async () => (await fetch(`${API_ENDPOINT}/fabricnetwork/uptime`)).json()
  getCurrentBlock = async () => (await fetch(`${API_ENDPOINT}/fabricnetwork/currentblock`)).json()
  getTransactions = async () => (await fetch(`${API_ENDPOINT}/fabricnetwork/transactions`)).json()
  getNumberOfNodes = async () => (await fetch(`${API_ENDPOINT}/fabricnetwork/activenodes`)).json()
}
