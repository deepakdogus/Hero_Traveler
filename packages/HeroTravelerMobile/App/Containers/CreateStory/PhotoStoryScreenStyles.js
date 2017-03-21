import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Themes/'

const third = (1 / 3) * (Metrics.screenHeight - Metrics.navBarHeight)

export const placeholderColor = Colors.darkBackground

export default StyleSheet.create({
  containerWithNavbarAndTabbar: {
    ...ApplicationStyles.screen.containerWithNavbarAndTabbar
  },
  spaceView: {
    height: third
  },
  titleInput: {
    marginTop: 20,
    marginLeft: 20,
    height: 28,
    fontSize: 28
  },
  subTitleInput: {
    height: 28,
    fontSize: 14,
    marginLeft: 20
  },
  addPhotoView: {
    height: third,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  addTitleView: {
    height: third
  },
  newContentButton: {
    padding: 10
  },
  createMenu: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  createMenuButton: {
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  addContentWrapper: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    backgroundColor: 'gray',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  addPhotoButton: {
    padding: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  baseTextColor: {
    color: Colors.darkBackground
  },
})
