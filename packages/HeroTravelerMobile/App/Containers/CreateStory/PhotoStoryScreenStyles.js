import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

const third = (1 / 3) * (Metrics.screenHeight - 20)

export const placeholderColor = Colors.darkBackground

export default StyleSheet.create({
  containerWithNavbarAndTabbar: {
    ...ApplicationStyles.screen.containerWithNavbarAndTabbar
  },
  lightGreyAreasBG: {
    backgroundColor: Colors.lightGreyAreas
  },
  spaceView: {
    height: third
  },
  titleInput: {
    ...Fonts.style.title,
    color: '#1a1c21',
    marginTop: 20,
    marginLeft: 20,
    height: 28,
    fontSize: 28,
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
  addPhotoButton: {
    padding: 50,
    justifyContent: 'center',
    backgroundColor: 'transparent'
  },
  baseTextColor: {
    color: Colors.darkBackground
  },
  iconDownView: {
    backgroundColor: Colors.snow,
    alignItems: 'center',
    paddingTop: Metrics.baseMargin / 2,
    paddingBottom: Metrics.baseMargin / 2
  }
})
