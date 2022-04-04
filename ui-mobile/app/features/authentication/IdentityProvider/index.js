// @flow
import * as React from 'react'

import IdentityContext from './context'
import login, { useRole } from './login'

type Props = {
  children: React.Node
}
type State = {
  login: (string, string) => any,
  token?: string,
  useRole: ('admin' | 'consumer' | 'supplychain') => any
}
export default class IdentityProvider extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
    this.state = {
      useRole: this.useRole,
      login: this.login
    }
  }

  useRole = async (role: 'admin' | 'consumer' | 'supplychain') => {
    const token = await useRole(role)
    this.setState({ token })
  }

  login = async (email: string, password: string) => {
    const token = await login({ email, password })
    this.setState({ token })
    return token;
  }

  render (): React.Node {
    return (
      <IdentityContext.Provider value={this.state}>
        { this.props.children }
      </IdentityContext.Provider>
    )
  }
}

export { IdentityContext } from './context'
