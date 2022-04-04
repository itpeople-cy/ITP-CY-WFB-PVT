// @flow
import * as React from 'react'
import { Button, Icon } from 'native-base'
import type NavigationScreenProp from 'react-navigation'

type Props = {
  navigator?: NavigationScreenProp,
  onPress?: () => void
}
type State = {}
export class HeaderBackButton extends React.Component<Props, State> {

  render (): React.Node {
    return (
      <Button
        transparent
        title='Back'
        onPress={this.props.onPress || (() => { this.props.navigator?.goBack() })}
      >
        <Icon name='arrow-back' />
      </Button>
    )
  }
}
