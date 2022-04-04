import { StyleSheet } from 'react-native'
import {widthPercentageToDP} from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
  root: {
    width: '100%',
    padding: 20,
    alignItems: 'center'
  },
  imageContainer: {
    width: widthPercentageToDP('50%')
  },
  image: {
    width: '100%'
  }
})
