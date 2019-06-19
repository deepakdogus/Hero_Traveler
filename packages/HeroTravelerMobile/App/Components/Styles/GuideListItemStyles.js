import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Shared/Themes'

export const imageWidth = 65
export const imageHeight = 50

export default StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  checkbox: {
    backgroundColor: Colors.snow,
    borderRadius: 18,
    height: 36,
    width: 36,
  },
  checkboxImage: {
    height: 36,
    width: 36,
  },
  image: {
    backgroundColor: Colors.errorPink,
    height: imageHeight,
    width: imageWidth,
  },
  placeholderImage: {
    width: 30,
    resizeMode: 'contain',
  },
  imageContainer: {
    backgroundColor: Colors.errorPink,
    height: imageHeight,
    width: imageWidth,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: Colors.background,
    letterSpacing: 0.7,
    fontSize: 15,
    fontWeight: '400',
    fontFamily: Fonts.type.sourceSansPro,
  },
  createLabel: {
    color: Colors.redHighlights,
    fontWeight: '600',
  },
})
