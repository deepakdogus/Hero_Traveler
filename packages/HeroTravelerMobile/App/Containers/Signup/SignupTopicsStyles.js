import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.background
  },
  header: {
    marginBottom: Metrics.section
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.snow
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 16,
    textAlign: 'center',
  }
})
