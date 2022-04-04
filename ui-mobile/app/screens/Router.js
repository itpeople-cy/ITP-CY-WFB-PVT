import { createAppContainer, createStackNavigator } from 'react-navigation'

import screens from './index'

// Return a router component that contains all screens from ./index
export default createAppContainer(
  createStackNavigator(
    Object.keys(screens).reduce((previousValue, key): {} => {
      previousValue[screens[key].screenId] = {
        screen: screens[key].component()
      }
      return previousValue
    }, {}),
    {
      defaultNavigationOptions: {
        header: null
      },
      initialRouteName: screens.PERSONA_SELECTION.screenId
    }
  )
)
