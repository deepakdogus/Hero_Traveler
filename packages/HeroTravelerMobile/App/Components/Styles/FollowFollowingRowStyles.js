import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  row: {
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 40,
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
  },
  avatarAndName: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '60%',
    height: 40,
  },
  avatar: {
    width: 40,
    height: 40,
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
    height: 25,
    width: 95,
    borderRadius: 100,
    marginVertical: 0,
    marginHorizontal: 0,
    padding: 5,
  },
  selectedFollowersButtonText: {
    fontSize: 10,
    marginVertical: 0,
    marginHorizontal: 5,
  },
  followersButton: {
    borderColor: Colors.red,
    borderWidth: 1,
    height: 25,
    width: 95,
    backgroundColor: Colors.snow,
    borderRadius: 100,
    marginVertical: 0,
    marginHorizontal: 0,
    padding: 5,
  },
  followersButtonText: {
    color: Colors.red,
    fontSize: 10,
    marginVertical: 0,
    marginHorizontal: 5,
  },
})