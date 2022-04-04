// @flow
import * as React from 'react'
import NavigationScreenProp, { NavigationEvents } from 'react-navigation'
import { Text, View, StyleSheet } from 'react-native'
import { Permissions, BarCodeScanner } from 'expo'

import LoadingOverlay from 'app/components/LoadingOverlay'
import IdentityContext from 'app/features/authentication/IdentityProvider/context'
import BaseTemplate from '../templates/BaseTemplate'
import { BackButton } from '../templates/BaseTemplate/Header'

import strings from './strings'
import styles from './styles'

type Props = {
  navigation: NavigationScreenProp,
}
type State = {
  hasCameraPermission: ?boolean,
  loading: boolean,
  scanned: boolean
}
export default class BarcodeScannerExample extends React.Component<Props, State> {

  state = {
    hasCameraPermission: undefined,
    loading: false,
    scanned: false,
  }

  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  handleBarCodeScanned = ({ type, data }: any, token: string) => {
    this.setState({ loading: true, scanned: true })

    const onScan = this.props.navigation.getParam('onScan')

    onScan({ data, type, token }, this.props.navigation, () => {this.resetScan()})
      .then((navigationCallback) => {
        if (navigationCallback) {
          navigationCallback()
        }
        else {
          this.setState(({ loading: false }))
        }
      })
      .catch(() => {
        this.setState(({ scanned: false }))
      })
  }

  resetScan = () => {
    this.setState({ scanned: false })
  }

  render() {
    const { hasCameraPermission, loading, scanned } = this.state
    const spinnerLabel = this.props.navigation.getParam('spinnerLabel')

    return (
      <BaseTemplate
        hideFooter
        headerProps={{
          leftComponent: <BackButton navigator={this.props.navigation} />,
          title: ''
        }}
      >
        <NavigationEvents
          onWillFocus={this.props.navigation.getParam('onInit')}
        />
        <LoadingOverlay
          textContent={spinnerLabel}
          visible={loading}
        />

        { hasCameraPermission === false && <Text>{strings.errorCameraPermissionDisabled}</Text> }

        { hasCameraPermission &&
          <View style={styles.barcodeScannerContainer}>
            <IdentityContext.Consumer>
              {({ token }) =>
                <BarCodeScanner
                  onBarCodeScanned={scanned ? undefined : (data) => {
                    this.handleBarCodeScanned(data, token)
                  }}
                  style={StyleSheet.absoluteFillObject}
                />
              }
            </IdentityContext.Consumer>
          </View>
        }
      </BaseTemplate>
    )
  }
}
