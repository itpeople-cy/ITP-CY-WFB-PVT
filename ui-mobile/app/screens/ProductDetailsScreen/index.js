// @flow
import * as React from 'react'
import NavigationScreenProp from 'react-navigation'
import QRCode from 'react-native-qrcode-svg'
import { Text, View } from 'native-base'
import { widthPercentageToDP } from 'react-native-responsive-screen'

import type { ProductDetails } from 'app/api/CounterfeitApi/types'
import ImageCarousel from 'app/components/ImageCarousel'

import { BackButton } from '../templates/BaseTemplate/Header'
import BaseTemplate from '../templates/BaseTemplate'
import strings from './strings'
import styles from './styles'
import TopContent from './TopContent'

type Props = {
  navigation: NavigationScreenProp
}
type State = {
}
export default class ProductDetailsScreen extends React.Component<Props, State> {

  constructor (props: Props) {
    super(props)
  }

  render (): React.Node {
    const productDetails: ProductDetails = this.props.navigation.getParam('productDetails')
    const imageStrings = productDetails.imageStrings;
    return (
      <BaseTemplate
        hideFooter
        contentContainerStyle={{}}
        headerProps={{
          leftComponent: <BackButton navigator={this.props.navigation} />,
          title: strings.title
        }}
      >
        <View style={styles.topImage}>
          <ImageCarousel
            data={imageStrings}
          />
        </View>
        <View style={styles.productDetailsContainer}>
          <TopContent productDetails={productDetails} />
          {/*<View style={styles.qrcodeContainer}>*/}
            {/*<QRCode*/}
              {/*size={widthPercentageToDP('33%')}*/}
              {/*value={JSON.stringify(tag.hash)}*/}
            {/*/>*/}
          {/*</View>*/}
          {/*<Text style={{ textAlign: 'center' }}>*/}
            {/*Tag Status: { tag.status.charAt(0).toUpperCase() + tag.status.slice(1) }*/}
          {/*</Text>*/}
        </View>
      </BaseTemplate>
    )
  }
}
