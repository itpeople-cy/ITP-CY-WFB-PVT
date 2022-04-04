// @flow
import * as React from 'react'
import { CardItem, Icon, Left, Right, Text, View } from 'native-base'

import styles from './styles'

type Props = {
  iconProps: Icon,
  label: string,
  onPress: () => void,
  sublabel?: string,
}
type State = {}
export default class CardNavigationItem extends React.Component<Props, State> {

  render (): React.Node {
    return (
      <CardItem bordered button onPress={this.props.onPress}>
        <Left>
          <View style={styles.iconContainer}>
            <Icon {...this.props.iconProps} style={styles.icon} />
          </View>
          <View>
            <Text style={styles.label}>
              { this.props.label }
            </Text>
            { this.props.sublabel &&
              <Text style={styles.sublabel}>
                { this.props.sublabel }
              </Text>
            }
          </View>
        </Left>
        <Right>
          <Icon name='arrow-forward' style={styles.icon} />
        </Right>
      </CardItem>
    )
  }
}
