import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.background,
    flex: 1
  },
  lightBG: {
    backgroundColor: Colors.snow,
    minHeight: Metrics.screenHeight
  },
  header: {
    marginBottom: Metrics.section
  },
  sectionHeader: {
    fontFamily: Fonts.type.montserrat,
    fontSize: 15,
    backgroundColor: Colors.lightGreyAreas,
    padding: Metrics.baseMargin,
    textAlign: 'center'
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    color: Colors.snow
  },
  subtitle: {
    ...Fonts.style.instructions,
    fontSize: 16,
    textAlign: 'center',
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
  },
  row: {
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: Metrics.baseMargin
  },
  nameWrapper: {
    flexGrow: 1
  },
  name: {
    fontSize: 15,
    fontWeight: '400',
    color: Colors.background
  },
  followerCount: {
    fontWeight: '300',
    fontSize: 14,
    color: '#757575'
  },
  selectedFollowersButton: {
    borderColor: Colors.red,
    borderWidth: 1,
    backgroundColor: Colors.red,
    height: 20,
    borderRadius: 5,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  selectedFollowersButtonText: {
    marginVertical: 0,
    marginHorizontal: 5,
  },
  followersButton: {
    borderColor: Colors.red,
    borderWidth: 1,
    height: 20,
    backgroundColor: Colors.snow,
    borderRadius: 5,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  followersButtonText: {
    color: Colors.red,
    marginVertical: 0,
    marginHorizontal: 5,
  },
  connectSocialText: {
    fontSize: 15,
    color: '#757575',
    fontWeight: '300',
    flexGrow: 2,
    marginLeft: Metrics.baseMargin
  },
  isConnectedText: {
    color: Colors.red,
    marginRight: Metrics.baseMargin
  },
  connectWrapper: {
    flexDirection: 'row'
  }
})
