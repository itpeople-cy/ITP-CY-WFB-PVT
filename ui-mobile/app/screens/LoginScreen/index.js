// @flow
import * as React from 'react'
import NavigationScreenProp from 'react-navigation'
import { Alert, View } from 'react-native'
import { Button, Input, Item, Text } from 'native-base'

import IdentityContext from 'app/features/authentication/IdentityProvider/context'
import BaseTemplate from '../templates/BaseTemplate'
import { BackButton } from '../templates/BaseTemplate/Header'
import styles from '../VerifyOwnershipScreen/styles'

type Props = {
  navigation: NavigationScreenProp,
  onLogin: (NavigationScreenProp) => void
}
type State = {
  emailAddress: ?string,
  loading: boolean,
  password: ?string
}
export default class LoginScreen extends React.Component<Props, State> {

  state = {
    emailAddress: '',
    loading: false,
    password: ''
  }

  render() {
    return (
      <BaseTemplate
        hideFooter
        headerProps={{
          leftComponent: <BackButton navigator={this.props.navigation} />,
          title: 'Login'
        }}
      >
        <IdentityContext.Consumer>
          {({ login }) =>
            <View style={{ padding: 30 }}>
              <Item regular>
                <Input
                  placeholder='Email address'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  onChangeText={emailAddress => { this.setState({ emailAddress })}}
                  value={this.state.emailAddress}
                />
              </Item>
              <Item regular>
                <Input
                  secureTextEntry
                  placeholder='Password'
                  autoCapitalize='none'
                  onChangeText={password => { this.setState({ password })}}
                  value={this.state.password}
                />
              </Item>
              <Button
                style={styles.sendPinButton}
                full
                disabled={!this.state.emailAddress || !this.state.password}
                onPress={async () => {
                  this.setState({ loading: true })
                  try {
                    const loginResponse = await login(this.state.emailAddress, this.state.password)
                    if (!loginResponse) {
                      Alert.alert('Oops', 'Please check your email and password and try again.');
                      this.setState({ loading: false })
                    } else {
                      this.props.navigation.getParam('onLogin')(this.props.navigation)
                    }
                  } catch {}
                }}
              >
                <Text>{ this.state.loading ? 'Logging in...' : 'Login'}</Text>
              </Button>
            </View>
          }
        </IdentityContext.Consumer>
      </BaseTemplate>
    )
  }
}
