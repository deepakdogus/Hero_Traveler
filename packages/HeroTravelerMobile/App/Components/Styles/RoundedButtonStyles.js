import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  button: {
    height: 45,
    borderRadius: 30,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.red,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  buttonText: {
    ...Fonts.style.buttonText,
    color: Colors.snow,
    textAlign: 'center',
    fontSize: Fonts.size.medium,
    marginVertical: Metrics.baseMargin,
    width: '95%',
    marginLeft: '2.5%',
    marginRight: '2.5%',
  }
})
