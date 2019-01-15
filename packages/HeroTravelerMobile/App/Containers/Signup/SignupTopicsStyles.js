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
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: 60,
  },
  title: {
    ...Fonts.style.title,
    fontSize: 20,
    textAlign: 'center',
    color: Colors.background,
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
    color: Colors.grey,
  },
})
