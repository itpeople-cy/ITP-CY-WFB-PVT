import { StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

const imageCircleDiameter = widthPercentageToDP('33%')

export default styles = StyleSheet.create({
  flex: {
    flex: 1
  },
  topContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: 20
  },
  sendPinButton: {
    marginTop: 30
  },
  enterPinContainer: {
    flexDirection: 'row',
    height: 50,
    marginTop: 30
  },
  enterPinInput: {
    flexGrow: 1,
    marginRight: 15
  }
})
