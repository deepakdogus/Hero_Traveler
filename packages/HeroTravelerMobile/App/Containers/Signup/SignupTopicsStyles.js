import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.feedDividerGrey,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.background,
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.grey,
  },
})
