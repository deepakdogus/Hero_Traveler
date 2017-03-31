import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.snow,
  },
  list: {
    height: Metrics.screenHeight - Metrics.navBarHeight - Metrics.tabBarHeight,
    width: Metrics.screenWidth,
  },
  commentWrapper: {
  	borderBottomWidth: 1,
  	borderBottomColor: Colors.navBarText,
  	backgroundColor: Colors.snow,
  },
  comment: {
    padding: Metrics.doubleBaseMargin,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTextWrapper: {
    flexDirection: 'column',
    flex: 1,
    justifyContent: 'flex-start',
    marginLeft: Metrics.baseMargin,
  },
  commentText: {
    fontFamily: Fonts.type.base,
    fontSize: 16,
    color: '#757575',
    fontWeight: '300',
    letterSpacing: .7,
  },
  commentName: {
    fontSize: 16,
    color: Colors.background,
    fontWeight: '400',
    letterSpacing: .7,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    marginRight: Metrics.baseMargin / 2,
  },
  iconAvatar: {
    marginRight: Metrics.baseMargin / 2,
  },
  nameAndTimeStamp: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  timestamp: {
    fontFamily: Fonts.type.base,
    fontSize: 12,
    color: '#757575',
    fontWeight: '300',
    letterSpacing: .7,
    textAlign: 'right',
    alignSelf: 'flex-start',
  },
  inputGroupWrapper: {
  	flexDirection: 'row',
  	height: Metrics.tabBarHeight,
  	borderWidth: 1,
  	borderColor: Colors.navBarText,
  	backgroundColor: Colors.lightGreyAreas,
  	justifyContent: 'flex-start',
  	alignItems: 'center',
  },
  inputWrapper: {
  	width: '70%',
  	height: Metrics.tabBarHeight/1.9,
  	alignSelf: 'center',
  	marginLeft: Metrics.doubleBaseMargin,
  },
  input: {
	flex: 1,
    backgroundColor: Colors.snow,
    fontSize: Fonts.size.medium,
    width: '100%',
    textAlign: 'left',
    fontFamily: Fonts.type.base,
    fontSize: Fonts.size.input,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: Colors.navBarText,
    color: '#757575',
    paddingLeft: 4
  },
  inputButton: {
  	width: '18%',
  	height: Metrics.tabBarHeight/1.4,
  	borderRadius: 10,
  	marginLeft: '2%',
  },
})
