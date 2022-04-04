// @flow
import * as React from 'react'
import type NavigationScreenProp from 'react-navigation'

import CounterfeitApi from 'app/api/CounterfeitApi'
import type { Retailer } from 'app/api/CounterfeitApi/types'
import { identities } from 'app/features/authentication/IdentityProvider/login'
import IdentityContext from 'app/features/authentication/IdentityProvider/context'
import CardNavigationItem from 'app/components/Card/CardNavigationItem'
import CardNavigationMenu from 'app/components/Card/CardNavigationMenu'
import BaseTemplate from '../templates/BaseTemplate'

import strings from './strings'
import screens from '../'

type Props = {
  navigation: NavigationScreenProp
}
type State = {
  retailers: Array<Retailer>
}
export default class PersonaSelectionScreen extends React.Component<Props, State> {

  state = {
    retailers: []
  }

  async componentDidMount () {
    let api = new CounterfeitApi()
    const token = await api.login(identities.admin)

    api = new CounterfeitApi(token)
    const retailers = await api.getRetailerList()
    console.log(retailers)
    this.setState({ retailers })
  }

  render (): React.Node {
    return (
      <BaseTemplate headerProps={{ title: strings.title }}>
        <CardNavigationMenu title='Choose a Persona'>
          <IdentityContext.Consumer>
            {({ useRole }) =>
              <>
                <CardNavigationItem
                  label='Factory'
                  iconProps={{
                    type: 'MaterialCommunityIcons',
                    name: 'factory'
                  }}
                  onPress={() => {
                    this.props.navigation.navigate(screens.LOGIN_SCREEN.screenId, {
                      onLogin: (navigation) => {
                        navigation.replace(screens.FACTORY_MENU_SCREEN.screenId)
                      }
                    })
                  }}
                />
                <CardNavigationItem
                  label='Supply Chain'
                  iconProps={{
                    type: 'MaterialCommunityIcons',
                    name: 'truck'
                  }}
                  onPress={() => {
                    useRole('supplychain')
                    this.props.navigation.navigate(screens.SUPPLY_CHAIN_MENU_SCREEN.screenId)
                  }}
                />
                { this.state.retailers &&
                  this.state.retailers.map((retailer: Retailer, index: number) =>
                    <CardNavigationItem
                      key={index}
                      label={`${retailer.name}`}
                      iconProps={{
                        type: 'MaterialIcons',
                        name: 'store'
                      }}
                      onPress={() => {
                        this.props.navigation.navigate(screens.LOGIN_SCREEN.screenId, {
                          onLogin: (navigation) => {
                            navigation.replace(screens.RETAILER_MENU_SCREEN.screenId)
                          }
                        })
                      }}
                    />
                )}
                <CardNavigationItem
                  label='Consumer'
                  iconProps={{
                    name: 'person'
                  }}
                  onPress={() => {
                    useRole('consumer')
                    this.props.navigation.navigate(screens.CONSUMER_MENU_SCREEN.screenId)
                  }}
                />

              </>
            }
          </IdentityContext.Consumer>

        </CardNavigationMenu>
      </BaseTemplate>
    )
  }
}
