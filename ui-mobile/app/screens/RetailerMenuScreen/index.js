// @flow
import * as React from 'react'
import NavigationScreenProp from 'react-navigation'
import { Alert, View } from 'react-native'
import { Button, Text } from 'native-base'

import CounterfeitApi from 'app/api/CounterfeitApi'
import CardNavigationMenu from 'app/components/Card/CardNavigationMenu'
import CardNavigationItem from 'app/components/Card/CardNavigationItem'

import BaseTemplate from '../templates/BaseTemplate'
import { BackButton } from '../templates/BaseTemplate/Header'
import strings from './strings'
import screens from '../index'
import DoubleScanCardNavigationItem from '../../features/camerascan/DoubleScanCardNavigationItem'
import type { AuthenticateTag } from '../../api/CounterfeitApi/types'

type Props = {
  navigation: NavigationScreenProp
}
type State = {
  isAuthenticateProductShown: boolean
}
export default class RetailerMenuScreen extends React.Component<Props, State> {

  state = {
    isAuthenticateProductShown: false,
  }

  fetchProductDetails = async ({data, type, token}: any, navigation: NavigationScreenProp) => {
    const api = new CounterfeitApi(token)
    let productId = data
    if (type === 256) { // QR Code
      const tag = await api.getTagDetails(data)
      productId = tag.productID
    }
    const productDetails = await api.getProductDetails(productId)
    return () => {
      navigation.replace(screens.PRODUCT_DETAILS_SCREEN.screenId,
        { productDetails })
    }
  }

  handleScannedTagForStatus = async ({data, token}: any, navigation: NavigationScreenProp) => {
    const api = new CounterfeitApi(token)
    const tag = await api.getTagDetails(data)
    return () => {
      navigation.replace(screens.TAG_DETAILS_SCREEN.screenId, { tag })
    }
  }

  authenticateTag = async (data: AuthenticateTag, token: any, navigation: NavigationScreenProp) => {
    const api = new CounterfeitApi(token)
    const isAuthentic = await api.authenticateTag(data)
    const [title, message] = (isAuthentic ? strings.tagVerified : strings.tagUnverified)
    this.showAuthenticationComplete(title, message, navigation)
  }

  showAuthenticationComplete = (title: string, message: string, navigation: NavigationScreenProp) => {
    Alert.alert(title, message,
      [{
        text: 'Okay', onPress: () => { navigation.goBack() }
      }],
      {
        onDismiss: () => { navigation.goBack() }
      })
    this.setState({ scannedProductID: undefined, scannedTagHash: undefined })
  }

  sellProduct = async ({ data, token }: any, navigation: NavigationScreenProp) => {
    const api = new CounterfeitApi(token)
    const productDetails = await api.getProductForSale(data)

    if (productDetails.success === false) {
      Alert.alert('Unable to sell product', productDetails.message,
        [{
          text: 'Okay', onPress: navigation.goBack
        }],
        {
          onDismiss: navigation.goBack
        })
    }
    else {
      return () => {
        navigation.replace(screens.SELL_PRODUCT_SCREEN.screenId, { productDetails })
      }
    }
  }

  render (): React.Node {
    const { isAuthenticateProductShown } = this.state;
    return (
      <BaseTemplate
        headerProps={{
          leftComponent: <BackButton navigator={this.props.navigation} />,
          title: strings.title
        }}
      >
        <CardNavigationMenu title='Select an Activity'>
          <CardNavigationItem
            label='Scan Product'
            iconProps={{
              type: 'MaterialCommunityIcons',
              name: 'barcode-scan'
            }}
            onPress={() => {
              this.props.navigation.navigate(screens.BARCODE_SCANNER_SCREEN.screenId, {
                onScan: this.fetchProductDetails,
                spinnerLabel: 'Retrieving Product...'
              })
            }}
          />
          {isAuthenticateProductShown && (
            <DoubleScanCardNavigationItem
              label='Authenticate Product'
              navigation={this.props.navigation}
              alertStrings={strings.authenticateProductAlerts}
              spinnerLabel='Authenticating Product...'
              iconProps={{
                type: 'MaterialCommunityIcons',
                name: 'check-circle-outline'
              }}
              onScanComplete={(productID, tagID, tagTechnology, token, navigation) => {
                this.authenticateTag({ productID, tagID }, token, navigation).catch(console.log)
              }}
            />
          )}
          <CardNavigationItem
            label='Scan Tag'
            iconProps={{
              type: 'MaterialCommunityIcons',
              name: 'qrcode-scan'
            }}
            onPress={() => {
              this.props.navigation.navigate(screens.BARCODE_SCANNER_SCREEN.screenId, {
                onScan: this.handleScannedTagForStatus,
                spinnerLabel: 'Loading Tag...',
              })
            }}
          />
          <CardNavigationItem
            label='Sell Product'
            iconProps={{
              type: 'MaterialCommunityIcons',
              name: 'cart-outline',
            }}
            onPress={() => {
              this.props.navigation.navigate(screens.BARCODE_SCANNER_SCREEN.screenId, {
                onScan: this.sellProduct,
                spinnerLabel: 'Loading Product...',
              })
            }}
          />
        </CardNavigationMenu>
        <View style={{
          width: '100%',
          padding: 20,
          alignItems: 'center'
        }}>
          <View>
            <Button light onPress={() => this.setState({ isAuthenticateProductShown: !isAuthenticateProductShown })}>
              <Text>
                ...
              </Text>
            </Button>
          </View>
        </View>
      </BaseTemplate>
    )
  }
}
