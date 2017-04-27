import { StyleSheet } from 'react-native'
import { Colors, Fonts, Metrics } from '../../Themes'

export default StyleSheet.create({
  text: {
    ...Fonts.style.instructions,
    textAlign: 'center',
    color: Colors.snow
  },
  linkText: {
    ...Fonts.style.instructions,
    color: Colors.snow,
    fontWeight: '800'
  },
  textWrapper: {
  	flexDirection:'row',
  	flexWrap:'wrap',
  	justifyContent: 'center',
  	alignItems: 'center'
  }
})
