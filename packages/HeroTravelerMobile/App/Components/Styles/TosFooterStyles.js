import { StyleSheet } from 'react-native'
import { Colors, Fonts, Metrics } from '../../Themes'

export default StyleSheet.create({
  text: {
    ...Fonts.style.instructions,
    textAlign: 'center',
    color: Colors.snow,
    fontSize: 13,
  },
  linkText: {
    ...Fonts.style.instructions,
    color: Colors.snow,
    fontWeight: '800',
    fontSize: 13,
  },
  textWrapper: {
  	flexDirection:'row',
  	flexWrap:'wrap',
  	justifyContent: 'center',
  	alignItems: 'center',
    marginLeft: Metrics.section*2.7,
    marginRight: Metrics.section*2.7,
    marginTop: Metrics.marginVertical*3,
  }
})
