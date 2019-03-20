import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
  },
  fakeNavBar: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: Colors.snow,
    zIndex: 2, // need to set this so embedded NativeFeeds can't capture clicks in the navBar
  },
  navBarBorder: {
    borderBottomColor: Colors.feedDividerGrey,
    borderBottomWidth: 1,
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
    height: 45,
  },
  searchWrapper: {
    marginTop: Metrics.baseMargin,
    flex: 1,
    flexDirection: 'row',
    height: Metrics.searchBarHeight,
    backgroundColor: Colors.feedDividerGrey,
    opacity: 0.6,
    paddingLeft: Metrics.baseMargin / 2,
    paddingRight: Metrics.baseMargin / 2,
    borderRadius: 5,
  },
  scrollWrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  searchInput: {
    flex: 0,
    fontSize: 13,
    color: Colors.background,
    textAlign: 'center',
    height: Metrics.searchBarHeight,
    marginLeft: 5,
    marginRight: 5,
  },
  searchInputFlex: {
    flex: 1,
    marginLeft: 25,
    marginRight: 25,
  },
  cancelBtn: {
    marginTop: 5,
    padding: Metrics.baseMargin,
    paddingRight: 0,
  },
  cancelBtnText: {
    color: Colors.signupGrey,
    fontFamily: Fonts.type.montserrat,
  },
  searchTitleWrapper: {
    backgroundColor: Colors.snow,
    height: 60,
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
  searchIconPosition: {
    flex: 1,
    marginVertical: 7.5,
    alignItems: 'flex-end',
  },
  searchIcon: {
    height: 15,
    width: 15,
  },
  InputXPosition: {
    flex: 1,
    alignItems: 'flex-end',
    height: 15,
    width: 15,
    marginVertical: 7.5,
  },
  InputXAbsolutePosition: {
    position: 'absolute',
    top: 0,
    right: 5,
    marginVertical: 7.5,
  },
  InputXView: {
    borderRadius: 100,
    justifyContent: 'center',
    height: 15,
    width: 15,
    paddingLeft: 2.5,
  },
  InputXViewHidden: {
    display: 'none',
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
  textContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  listItemText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.background,
  },
  listItemSecondaryText: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.grey,
  },
  noFindText: {
    color: 'white',
    padding: Metrics.section,
    textAlign: 'center',
  },
  noResults: {
    alignItems: 'center',
    padding: 30,
  },
  noResultsText: {
    color: Colors.background,
  },
  noRecentSearchesText: {
    color: Colors.background,
    textAlign: 'left',
  },
  postcardIconWrapper: {
    marginTop: isIPhoneX() ? 30 : 5,
    padding: Metrics.baseMargin,
    paddingLeft: 0,
  },
  postcardIcon: {
    height: 22,
    width: 30,
  },
})
