// @flow
import React from 'react'
import { View } from 'react-native'
import { Font } from 'expo';
import { Ionicons } from '@expo/vector-icons'

import Router from './app/screens/Router'
import IdentityProvider from './app/features/authentication/IdentityProvider'

type State = {
  fontLoaded: boolean
}
export default class App extends React.Component<void, State> {

  state = {
    fontLoaded: false
  }

  async componentDidMount () {
    await Font.loadAsync({
      'Roboto': require('native-base/Fonts/Roboto.ttf'),
      'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    })
    this.setState({ fontLoaded: true })
  }

  render () {
    return !this.state.fontLoaded
      ? <View />
      : (
      <IdentityProvider>
        <Router />
      </IdentityProvider>
    )
  }
}
