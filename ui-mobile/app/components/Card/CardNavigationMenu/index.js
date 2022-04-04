// @flow
import * as React from 'react'
import { View } from 'react-native'
import { Card, CardItem, Text } from 'native-base'

import CardNavigationItem from '../CardNavigationItem'
import styles from './styles'

type Props = {
  children: React.ChildrenArray<React.Element<typeof CardNavigationItem>>,
  title: string
}
type State = {}
export default class CardNavigationMenu extends React.Component<Props, State> {

  render (): React.Node {
    return (
      <View style={styles.root}>
        <Card style={styles.contentContainer}>
          <CardItem header bordered>
            <Text>{ this.props.title }</Text>
          </CardItem>
          { this.props.children }
        </Card>
      </View>
    )
  }
}
