import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  textInputContainer: {
    flex: 1,
    position: 'relative'
  },
  textInput: {
    flexGrow: 1,
    margin: Metrics.doubleBaseMargin,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'column'
  },
})
