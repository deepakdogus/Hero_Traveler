import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollItemFullScreen: {
    marginTop: isIPhoneX() ? Metrics.navBarHeight + 15 : Metrics.navBarHeight,
    backgroundColor: Colors.transparent,
    borderTopColor: Colors.feedDividerGrey,
    borderTopWidth: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    fontSize: 24,
    color: Colors.snow,
  },
  tabs: {
    flex: 1,
  },
  tabnav: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.snow,
  },
  tabContent: {
    flex: 1,
    paddingTop: Metrics.baseMargin,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderBottomWidth: 3,
    borderBottomColor: Colors.lightGreyAreas,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.grey,
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  tabSelected: {
    borderBottomColor: Colors.red,
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.grey,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  activityList: {
    flex: 1,
  },
})
