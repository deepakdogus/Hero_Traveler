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
    width: 40,
    height: 40,
    borderRadius: 20,
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
  followersButton: {
    height: 20,
    borderRadius: 5,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  followersButtonText: {
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
