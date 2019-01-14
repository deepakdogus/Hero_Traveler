import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
  },
  fakeNavBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: Metrics.navBarHeight + 20, // 120 nav height = 60 + 40 tab bar + 20
    backgroundColor: Colors.snow,
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
    color: Colors.background,
    textAlign: 'center',
    height: Metrics.searchBarHeight,
    marginLeft: 25,
    marginRight: 25,
  },
  cancelBtn: {
    marginTop: isIPhoneX() ? 30 : 5,
    padding: Metrics.baseMargin,
    paddingRight: 0,
  },
  cancelBtnText: {
    color: Colors.signupGrey,
    fontFamily: Fonts.type.montserrat,
  },
  searchTitleWrapper: {
    height: 46,
    marginTop: Metrics.doubleBaseMargin,
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    paddingTop: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin / 2,
    justifyContent: 'flex-end',
    borderBottomWidth: 1,
    borderBottomColor: Colors.feedDividerGrey,
  },
  searchTitleText: {
    fontSize: 16,
    letterSpacing: 0.7,
    fontWeight: '600',
    color: Colors.background,
  },
  searchRowItem: {
    marginLeft: Metrics.doubleBaseMargin,
    marginRight: Metrics.doubleBaseMargin,
    padding: 0,
    paddingTop: Metrics.baseMargin,
    paddingBottom: Metrics.baseMargin,
    paddingLeft: 0,
    paddingRight: 0,
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
    color: Colors.background,
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
    color: Colors.background,
    backgroundColor: 'rgba(0,0,0,.4)',
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    textAlign: 'center',
    lineHeight: 100,
  },
  tabsViewContainer: {
    flex: 1,
  },
  tabnav: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    backgroundColor: Colors.clear,
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
    color: Colors.background,
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
    flex: 1,
  },
  noResults: {
    alignItems: 'center',
    padding: 30,
  },
  noResultsText: {
    color: Colors.background,
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
