import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.background,
    paddingTop: Metrics.baseMargin*2,
  },
  loader: {
    height: Metrics.screenHeight - 100 - Metrics.tabBarHeight,
  },
  headerSearch: {
    marginHorizontal: Metrics.baseMargin,
    // flexDirection: 'column',
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 45,
  },
  searchWrapper: {
    marginTop: Metrics.baseMargin,
    flex: 1,
    height: Metrics.searchBarHeight,
    backgroundColor: '#424242',
    opacity: .6,
    paddingLeft: Metrics.baseMargin/2,
    paddingRight: Metrics.baseMargin/2,
    borderRadius: 5,
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
    marginTop: 5,
    padding: Metrics.baseMargin,
    paddingRight: 0
  },
  cancelBtnText: {
    color: '#9e9e9e',
    fontFamily: Fonts.type.montserrat,
  },
  titleWrapper: {
    flex: 1,
    marginVertical: Metrics.doubleBaseMargin,
    marginTop: 13.5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    color: Colors.snow,
    textAlign: 'center'
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
    backgroundColor: Colors.transparent
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
    lineHeight: 100
  },
  tabs: {
    flex: 1
  },
  tabnav: {
    height: 46,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.whiteAlphaPt15,
    marginTop: 12,
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
    color: '#9e9e9e',
    fontSize: 13,
    letterSpacing: 1.2,
    textAlign: 'center'
  },
  tabSelected: {
    borderBottomColor: Colors.red
  },
  tabTextSelected: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.white,
    fontSize: 13,
    letterSpacing: 1.2,
  },
  storyTitleStyle: {
    fontSize: 12
  },
  storySubtitleStyle: {
    fontSize: 8
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
  }
})

export const CategoryFeedNavActionStyles = StyleSheet.create({
  leftButtonIconStyle: {tintColor: Colors.navBarText},
  navigationBarStyle: {
    paddingTop: 5,
    borderBottomWidth: 0,
    height: Metrics.navBarHeight - 10,
    backgroundColor: Colors.background,
  },
})
