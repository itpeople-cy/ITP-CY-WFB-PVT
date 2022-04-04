// @flow
import * as React from 'react'
import { Card, CardItem, Text, View } from 'native-base'

import type { ProductDetails } from 'app/api/CounterfeitApi/types'

import styles from './styles'

type Props = {
  productDetails: ProductDetails
}
type State = {}
export default class TopContent extends React.Component<Props, State> {

  render (): React.Node {
    const product = this.props.productDetails.product
    const style = this.props.productDetails.ProductStyle
    return (
      <>
        <View style={styles.productInfoRow}>
          <Text style={styles.header}>{style.name}</Text>
        </View>
        <View style={Object.assign({}, styles.productInfoRow, styles.gridRow)}>
          <ProductInfo label='MSRP' value={product.msrp} />
          <ProductInfo label='Color' value={product.color} />
        </View>
        <View style={styles.productInfoRow}>
          <ProductInfo label='Description' value={style.description || '[No description]'} />
        </View>

        <View style={styles.productInfoRow}>
          <Card>
            <CardItem header bordered>
              <Text>Product Details</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.productInfoRowLabel}>SKU:</Text><Text>{product.skuID}</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.productInfoRowLabel}>UPC:</Text><Text>{product.upCode}</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.productInfoRowLabel}>Size:</Text><Text>{style.size}</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.productInfoRowLabel}>Weight:</Text><Text>{style.weight}</Text>
            </CardItem>
          </Card>
        </View>
        <View style={styles.productInfoRow}>
          <Card>
            <CardItem header bordered>
              <Text>Manufacturing</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.productInfoRowLabelOpaque}>ID:</Text>
              <Text style={styles.opaque}>{product.manufacturerID}</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.productInfoRowLabelOpaque}>Manufacture Date:</Text>
              <Text style={styles.opaque}>{product.manufactureDate.substring(0, 10)}</Text>
            </CardItem>
            <CardItem>
              <Text style={styles.productInfoRowLabelOpaque}>Shipped Date:</Text>
              <Text style={styles.opaque}>{product.shippedDate.substring(0, 10) || '-'}</Text>
            </CardItem>
          </Card>
        </View>
      </>
    )
  }
}

function ProductInfo (props: { label: string, value: string }) {
  return (
    <View style={styles.flex}>
      <Text style={styles.infoLabel}>{props.label}</Text>
      <Text>{props.value}</Text>
    </View>
  )
}
