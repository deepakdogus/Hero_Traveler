import { StyleSheet } from 'react-native'
import {
  ApplicationStyles,
  Colors,
  Metrics,
  Fonts,
} from '../../Shared/Themes'

export default StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: Metrics.baseMargin,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  checkbox: {
    backgroundColor: Colors.white,
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
    height: 50,
    width: 65,
    resizeMode: 'contain',
  },
  placeholderImage: {
    width: 30,
    resizeMode: 'contain'
  },
  imageContainer: {
    backgroundColor: Colors.errorPink,
    height: 50,
    width: 65,
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
  }
})
