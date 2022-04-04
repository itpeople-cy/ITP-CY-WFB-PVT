import * as React from 'react'

const IdentityContext = React.createContext(
  {
    token: '',
    useRole: () => {}
  }
)
export default IdentityContext
