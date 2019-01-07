import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.background,
    flex: 1,
  },
  lightBG: {
    backgroundColor: Colors.snow,
    // minHeight: Metrics.screenHeight
  },
  emptyMessage: {
    marginTop: Metrics.doubleSection,
  },
  emptyMessageText: {
    textAlign: 'center',
    fontSize: 16,
    color: Colors.steel,
  },
  header: {
    marginBottom: Metrics.section,
  },
  sectionHeader: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 15,
    backgroundColor: Colors.lightGreyAreas,
    padding: Metrics.baseMargin,
    textAlign: 'center',
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.snow,
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 16,
    textAlign: 'center',
  },

  connectSocialText: {
    fontSize: 15,
    color: Colors.grey,
    fontWeight: '300',
    flexGrow: 2,
    marginLeft: Metrics.baseMargin,
  },
  isConnectedText: {
    color: Colors.red,
    marginRight: Metrics.baseMargin,
  },
  connectWrapper: {
    flexDirection: 'row',
  },
})
