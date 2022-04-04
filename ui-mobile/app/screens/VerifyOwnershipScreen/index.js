// @flow
import * as React from 'react'
import NavigationScreenProp from 'react-navigation'
import { Alert } from 'react-native'
import { Button, Input, Item, Text, View } from 'native-base'

import CounterfeitApi from 'app/api/CounterfeitApi'
import IdentityContext from 'app/features/authentication/IdentityProvider/context'

import strings from './strings'
import screens from '../index'
import { BackButton } from '../templates/BaseTemplate/Header'
import BaseTemplate from '../templates/BaseTemplate'
import styles from './styles'

type Props = {
  navigation: NavigationScreenProp
}
type State = {
  emailAddress: string,
  errorMessage?: string,
  performingVerification: boolean,
  pinCode: ?string,
  pinCodeRequested?: boolean
}
export default class VerifyOwnershipScreen extends React.Component<Props, State> {

  state = {
    emailAddress: '',
    performingVerification: false,
    pinCode: ''
  }

  verifyEmail = async (token: string) => {
    this.setState({ pinCode: undefined, performingVerification: true })
    const api = new CounterfeitApi(token)
    const isVerified = await api.verifyEmail(this.state.emailAddress, this.state.pinCode)
    if (isVerified) {
      this.runVerification(token).catch(console.log)
    }
    else {
      Alert.alert('Error', 'Email address could not be verified with this code.',
        [{
          text: 'Try again', onPress: () => { this.setState({ performingVerification: false }) }
        }],
        {
          onDismiss: () => { this.setState({ performingVerification: false }) }
        })
    }
  }

  runVerification = async (token: string) => {
    const { navigation } = this.props

    this.setState({ pinCode: undefined, performingVerification: true })
    const api = new CounterfeitApi(token)
    api.verifyCertificate({
      email: this.state.emailAddress,
      hash: navigation.getParam('hash'),
      productID: navigation.getParam('productId')
    }).then(isValid => {
      const [title, message] = isValid ? strings.tagVerified : strings.tagUnverified
      Alert.alert(title, message,
        [{
          text: 'Go Home', onPress: () => { navigation.replace(screens.PERSONA_SELECTION.screenId) }
        }],
        {
          onDismiss: () => { navigation.replace(screens.PERSONA_SELECTION.screenId) }
        })
    })
  }

  render (): React.Node {
    return (
      <IdentityContext.Consumer>
        {({ token }) =>
          <BaseTemplate
            headerProps={{
              title: this.state.pinCodeRequested ? 'Verify PIN' : 'Verify Email',
              leftComponent: this.state.pinCodeRequested ? (
                <BackButton onPress={() => { this.setState({ pinCodeRequested: false })}} />
              ) : (
                <BackButton navigator={this.props.navigation} />
              )
            }}
          >
            <View style={styles.topContent}>
              <Text style={{ fontSize: 18, color: '#555' }}>
                Verify the email address associated to this certificate.
              </Text>
            </View>
            <View style={{ flex: 3, padding: 20 }}>
              { !this.state.pinCodeRequested &&
                <>
                  <Item regular>
                    <Input
                      placeholder='Email address'
                      keyboardType='email-address'
                      autoCapitalize='none'
                      onChangeText={emailAddress => { this.setState({ emailAddress })}}
                      value={this.state.emailAddress}
                    />
                  </Item>
                  <Button
                    style={styles.sendPinButton}
                    full
                    disabled={!this.state.emailAddress}
                    onPress={() => {
                      const api = new CounterfeitApi(token)
                      api.sendEmailVerification(this.state.emailAddress)
                        .catch(console.log)
                      this.setState({ pinCodeRequested: true })
                    }}
                  >
                    <Text>Send PIN Code</Text>
                  </Button>
                </>
              }
              { this.state.pinCodeRequested &&
                <>
                  <View style={{ alignItems: 'center' }}>
                    <Text>
                      PIN Code sent to
                    </Text>
                    <Text style={{ fontWeight: 'bold' }}>
                      {this.state.emailAddress}
                    </Text>
                  </View>
                  <View style={styles.enterPinContainer}>
                    <View style={styles.enterPinInput}>
                      <Item regular>
                        <Input
                          placeholder='PIN Code'
                          // keyboardType='numeric'
                          onChangeText={pinCode => { this.setState({ pinCode })}}
                          value={this.state.pinCode}
                        />
                      </Item>
                    </View>
                    <Button
                      style={{ height: 50 }}
                      disabled={!this.state.pinCode}
                      onPress={() => {
                        this.verifyEmail(token).catch(console.log)
                      }}
                    >
                      <Text>{ !this.state.performingVerification ? 'Certify PIN' : 'Verifying...'}</Text>
                    </Button>
                  </View>
                  { this.state.errorMessage &&
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.errorMessage}>
                        {this.state.errorMessage}
                      </Text>
                    </View>
                  }
                </>
              }
            </View>
          </BaseTemplate>
        }
      </IdentityContext.Consumer>
    )
  }
}
