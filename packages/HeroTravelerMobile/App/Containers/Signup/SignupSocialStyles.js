import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
    flex: 1,
  },
  lightBG: {
    backgroundColor: Colors.snow,
  },
  listContainer: {
    marginTop: isIPhoneX() ? Metrics.navBarHeight + 20 : Metrics.navBarHeight,
    borderTopWidth: 1,
    borderTopColor: Colors.feedDividerGrey,
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
    fontSize: 20,
    textAlign: 'center',
    color: Colors.background,
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.grey,
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
