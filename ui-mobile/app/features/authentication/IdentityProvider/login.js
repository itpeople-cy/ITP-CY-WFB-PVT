// @flow
import CounterfeitApi from 'app/api/CounterfeitApi'

// These identities need to be created by an admin user before they will work
const identities = {
  admin: {
    email: 'admin@example.com',
    password: 'test123'
  },
  consumer: {
    email: 'consumer@example.com',
    password: 'test123'
  },
  supplychain: {
    email: 'warehouse@example.com',
    password: 'test123'
  },
}

const useRole = async (role: 'admin' | 'consumer' | 'supplychain') => {
  try {
    return await login(identities[role])
  } catch (e) {
    console.log(e)
  }
}
const login = async ({ email, password }: any) => {
  try {
    const response = await new CounterfeitApi().login({ email, password })
    console.log(response)
    return response
  } catch (e) {
    console.log(e)
    return undefined
  }
}

export default login
export { identities, useRole }
