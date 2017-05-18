import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  button: {

    flexDirection: 'column',
    backgroundColor: 'transparent',
    justifyContent: 'center'
  },
  view: {
    backgroundColor: Colors.snow,
    borderRadius: 5,
    marginHorizontal: Metrics.section,
    marginVertical: Metrics.baseMargin,
  },
  buttonText: {
    ...Fonts.style.buttonText,
    color: Colors.background,
    textAlign: 'center',
    fontSize: Fonts.size.medium,
    fontWeight: '400',
    marginVertical: Metrics.baseMargin
  }
})
