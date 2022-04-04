// @flow
import * as React from 'react'
import NavigationScreenProp from 'react-navigation'
import QRCode from 'react-native-qrcode-svg'
import { Button, Text, View } from 'native-base'

import screens from '../index'
import BaseTemplate from '../templates/BaseTemplate'
import styles from './styles'
import strings from './strings'

type Props = {
  navigation: NavigationScreenProp
}
type State = {}
export default class FinishedTransactionScreen extends React.Component<Props, State> {

  render (): React.Node {
    const { navigation } = this.props
    return (
      <BaseTemplate headerProps={{ title: 'Certificate of Purchase' }}>
        <View style={styles.topContent}>
          <View>
            <Text style={styles.topContentText}>{strings.finishedTransactionText}</Text>
          </View>
          <View style={styles.qrcodeContainer}>
            <QRCode
              size={125}
              value={navigation.getParam('certificateHash')}
            />
          </View>
          <View>
            <Text style={styles.topContentText}>{strings.finishedTransactionSubtext}</Text>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <Button
            full bordered
            onPress={() => {
              navigation.navigate(screens.PRODUCT_DETAILS_SCREEN.screenId,
              navigation.state.params)
            }}
          >
            <Text>See Product Details</Text>
          </Button>
          <Button
            full
            style={{ marginTop: 30 }}
            onPress={() => { navigation.navigate(screens.PERSONA_SELECTION.screenId) }}
          >
            <Text>Go Home</Text>
          </Button>
        </View>
      </BaseTemplate>
    )
  }
}
