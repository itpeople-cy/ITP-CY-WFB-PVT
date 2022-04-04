// @flow
import * as React from 'react'
import NavigationScreenProp from 'react-navigation'
import { Alert } from 'react-native'

import CardNavigationMenu from 'app/components/Card/CardNavigationMenu'
import CardNavigationItem from 'app/components/Card/CardNavigationItem'

import BaseTemplate from '../templates/BaseTemplate'
import { BackButton } from '../templates/BaseTemplate/Header'
import styles from './styles'
import strings from './strings'
import screens from '../index'
import { CardItem, Icon, Left, Right, Text, View } from 'native-base'
import DoubleScanCardNavigationItem from '../../features/camerascan/DoubleScanCardNavigationItem'

type Props = {
  navigation: NavigationScreenProp
}
type State = {}
export default class ConsumerMenuScreen extends React.Component<Props, State> {

  render (): React.Node {
    return (
      <BaseTemplate
        headerProps={{
          leftComponent: <BackButton navigator={this.props.navigation} />,
          title: strings.title
        }}
      >
        <CardNavigationMenu title='Select an Activity'>
          <DoubleScanCardNavigationItem
            label='Verify Ownership'
            navigation={this.props.navigation}
            alertStrings={strings.verifyOwnershipAlerts}
            spinnerLabel='Verifying ownership...'
            iconProps={{
              type: 'MaterialCommunityIcons',
              name: 'qrcode-scan'
            }}
            onScanComplete={(productId, hash, tagTechnology, token, navigation) => {
              navigation.navigate(screens.VERIFY_OWNERSHIP_SCREEN.screenId, { productId, hash })
            }}
          />
          <CardItem
            bordered button
            onPress={() => {
              const [title, message] = strings.resellAlertMessage
              Alert.alert(title, message, [{ text: 'Close', onPress: () => {} }])
            }}
          >
            <Left>
              <View style={styles.iconContainerOpaque}>
                <Icon name='swap' style={styles.iconOpaque} />
              </View>
              <Text style={styles.labelOpaque}>Resell Product</Text>
            </Left>
            <Right>
              <Icon name='information-circle-outline' style={styles.iconOpaque} />
            </Right>
          </CardItem>
        </CardNavigationMenu>
      </BaseTemplate>
    )
  }
}
