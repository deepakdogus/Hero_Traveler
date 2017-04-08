import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  scrollItemFullScreen: {
    height: Metrics.screenHeight - Metrics.navBarHeight,
    width: Metrics.screenWidth,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  message: {
    fontSize: 24,
    color: '#fff'
  },
  tabs: {
  },
  tabnav: {
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tabContent: {
    paddingTop: Metrics.baseMargin
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderBottomWidth: 2,
    borderBottomColor: Colors.snow,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: '#bdbdbd',
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center'
  },
  tabSelected: {
    borderBottomColor: Colors.red
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: '#757575',
    fontSize: 13,
    letterSpacing: 1.2,
  },
  activityList: {
    
  }
})
