// @flow
import * as React from 'react'
import { Container, Content, RnViewStyleProp } from 'native-base'

import Footer from './Footer'
import Header from './Header'
import type { HeaderProps } from './Header'

type Props = {
  children: React.Node,
  contentContainerStyle?: RnViewStyleProp | Array<RnViewStyleProp>,
  fixedTopContent?: React.Node,
  headerProps?: HeaderProps,
  hideFooter?: boolean
}
type State = {}
export default class BaseTemplate extends React.Component<Props, State> {

  render (): React.Node {
    return (
      <Container>
        { this.props.headerProps && <Header {...this.props.headerProps} /> }
        <Content contentContainerStyle={this.props.contentContainerStyle || { flex: 1 }}>
          { this.props.children }
        </Content>
        { !this.props.hideFooter && <Footer /> }
      </Container>
    )
  }
}
