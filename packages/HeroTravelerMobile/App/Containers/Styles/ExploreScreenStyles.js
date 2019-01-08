import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
  },
  fakeNavBar: {
    height: Metrics.navBarHeight - 8, // 120 === 88 nav + 40 tabbar - 8, per mocks
    backgroundColor: Colors.snow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loader: {
    height: Metrics.screenHeight - 100 - Metrics.tabBarHeight,
  },
  searchLoader: {
    flex: 1,
    position: 'absolute',
    marginTop: 400,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  headerSearch: {
    marginHorizontal: Metrics.baseMargin,
    // flexDirection: 'column',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: isIPhoneX() ? 60 : 45,
  },
  searchWrapper: {
    marginTop: isIPhoneX() ? Metrics.baseMargin + 25 : Metrics.baseMargin,
    flex: 1,
    height: Metrics.searchBarHeight,
    backgroundColor: Colors.feedDividerGrey,
    opacity: .6,
    paddingLeft: Metrics.baseMargin / 2,
    paddingRight: Metrics.baseMargin / 2,
    borderRadius: 5,
  },
  scrollWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.snow,
    textAlign: 'center',
    height: Metrics.searchBarHeight,
    marginLeft: 25,
    marginRight: 25,
  },
  cancelBtn: {
    marginTop: isIPhoneX() ? 20 : 5,
    padding: Metrics.baseMargin,
    paddingRight: 0,
  },
  cancelBtnText: {
    color: Colors.signupGrey,
    fontFamily: Fonts.type.montserrat,
  },
  titleWrapper: {
    flex: 1,
    marginVertical: Metrics.doubleBaseMargin,
    marginTop: 13.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    color: Colors.snow,
    textAlign: 'center',
  },
  grid: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: Metrics.baseMargin,
    marginRight: Metrics.baseMargin,
  },
  gridRow: {
    width: (Metrics.screenWidth - 33) / 3,
    height: 100,
    margin: 2,
    backgroundColor: Colors.transparent,
  },
  gridImage: {
    width: (Metrics.screenWidth - 33) / 3,
    height: 100,
  },
  gridRowText: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 13,
    color: Colors.snow,
    backgroundColor: 'rgba(0,0,0,.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: 100,
  },
  tabs: {
    flex: 1,
  },
  tabnav: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteAlphaPt15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.feedDividerGrey,
  },
  tab: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
    borderBottomWidth: 3,
    borderBottomColor: Colors.clear,
  },
  tabText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.signupGrey,
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.2,
    textAlign: 'center',
  },
  tabSelected: {
    borderBottomColor: Colors.red,
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.background,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  storyTitleStyle: {
    fontSize: 12,
  },
  storySubtitleStyle: {
    fontSize: 8,
  },
  thumbnailImage: {
    height: 40,
    width: 30,
  },
  InputXPosition: {
    position: 'absolute',
    top: 0,
    right: 5,
  },
  InputXView: {
    backgroundColor: '#616161',
    borderRadius: 100,
    justifyContent: 'center',
    height: 15,
    width: 15,
    paddingLeft: 2.5,
    marginVertical: 7.5,
  },
  InputXIcon: {
    width: 10,
    height: 10,
    paddingLeft: 5,
  },
  PlayButton: {
    position: 'absolute',
    marginHorizontal: 5,
    marginTop: 10,
  },
  videoCoverWrapper: {
    position: 'relative',
  },
  listItemText: {
    fontSize: 15,
    color: Colors.snow,
  },
  listItemTextSecondary: {
    fontSize: 12,
    color: Colors.navBarText,
    fontStyle: 'italic',
  },
  noFindText: {
    color: 'white',
    padding: Metrics.section,
    textAlign: 'center',
  },
  tabStyle: {
    width: Metrics.screenWidth * 0.4,
  },
})

export const CategoryFeedNavActionStyles = StyleSheet.create({
  leftButtonIconStyle: { tintColor: Colors.navBarText },
  navigationBarStyle: {
    paddingTop: 5,
    borderBottomWidth: 0,
    height: Metrics.navBarHeight - 10,
    backgroundColor: Colors.background,
  },
})
