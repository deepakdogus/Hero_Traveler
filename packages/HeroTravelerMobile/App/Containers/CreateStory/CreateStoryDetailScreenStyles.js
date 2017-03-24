import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginHorizontal: Metrics.doubleBaseMargin
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: Metrics.section,
  },
  fieldWrapper: {
    borderBottomColor: Colors.navBarText,
    borderBottomWidth: 1,
    marginVertical: Metrics.baseMargin,
    flexDirection: 'row',
    // justifyContent: 'flex-start'
    alignItems: 'center'
  },
  fieldLabel: {
    marginBottom: 5,
    fontSize: 12
  },
  fieldIcon: {
    marginRight: Metrics.doubleBaseMargin,
    width: 18,
  },
  inputStyle: {
    flexGrow: 1,
    color: Colors.background,
    fontSize: 16,
    height: 30
  }
})
