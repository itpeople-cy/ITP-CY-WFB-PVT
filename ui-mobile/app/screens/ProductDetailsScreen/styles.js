import { StyleSheet } from 'react-native'
import { heightPercentageToDP } from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
  topImage: {
    height: heightPercentageToDP('33%'),
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  productDetailsContainer: {
    padding: 30,
    backgroundColor: '#f6f6f6',
  },
  productInfoRow: {
    paddingBottom: 30,
    backgroundColor: '#f6f6f6',
  },
  productInfoRowLabel: {
    marginRight: 10,
    fontWeight: 'bold',
  },
  productInfoRowLabelOpaque: {
    marginRight: 10,
    fontWeight: 'bold',
    color: 'rgba(0,0,0,0.3)',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: '#f6f6f6',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: '#f6f6f6',
  },
  opaque: {
    color: 'rgba(0,0,0,0.3)'
  },
  flex: {
    flex: 1
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row'
  },
  qrcodeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 30,
    backgroundColor: '#f6f6f6',
  }
})
