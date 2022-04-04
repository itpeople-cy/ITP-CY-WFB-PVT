// @flow
import * as React from 'react'
import { Image, View } from 'react-native'

import styles from './styles'

type Props = {}
type State = {}
export default class Footer extends React.Component<Props, State> {

  render (): React.Node {
    return (
      <View style={styles.root}>
        <View style={styles.imageContainer}>
          <Image
            source={require('./chainyard-logo.png')}
            resizeMode='contain'
            style={styles.image}
          />
        </View>
      </View>
    )
  }
}
