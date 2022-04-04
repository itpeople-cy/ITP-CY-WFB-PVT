// @flow
import * as React from 'react'
import { Body, Header as NativeBaseHeader, Left, Title } from 'native-base'

export { HeaderBackButton as BackButton } from './HeaderBackButton'

export type HeaderProps = {
  leftComponent?: React.Node,
  rightComponent?: React.Node,
  title: string
}
type State = {}
export default class Header extends React.Component<HeaderProps, State> {

  render (): React.Node {
    return (
      <NativeBaseHeader noLeft={this.props.leftComponent === undefined}>
        { this.props.leftComponent &&
          <Left>
            { this.props.leftComponent }
          </Left>
        }
        <Body>
          <Title>{ this.props.title }</Title>
        </Body>
      </NativeBaseHeader>
    )
  }
}
