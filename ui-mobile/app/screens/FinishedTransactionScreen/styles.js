import { StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
  topContent: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30
  },
  topContentText: {
    textAlign: 'center',
    fontSize: 16,
    lineHeight: 24
  },
  flex: {
    flex: 1
  },
  buttonContainer: {
    flex: 1,
    padding: 30
  },
  qrcodeContainer: {
    paddingTop: 20,
    margin: 40
  }
})
