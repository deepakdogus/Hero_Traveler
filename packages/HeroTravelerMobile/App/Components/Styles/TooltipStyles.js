import { StyleSheet } from 'react-native'
import { Colors, Fonts, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  /* Background */

  backgroundOverlay: {
    position: 'absolute',
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundOverlayFullScreen: {
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
    flex: 1,
  },
  backgroundOverlayDimmed: {
    backgroundColor: 'rgba(0,0,0,.7)',
  },

  /* Generic Tooltips */

  container: {
    width: Metrics.screenWidth,
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop: 5,
    shadowColor: 'black',
    shadowOpacity: 0.25,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 1,
  },
  textContainer: {
    maxWidth: Metrics.screenWidth * 0.75,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    borderColor: Colors.steel,
    borderWidth: 1,
  },
  tip: {
    position: 'absolute',
    top: -5,
    height: 0,
    width: 0,
    borderColor: 'white',
    borderLeftWidth: 6,
    borderLeftColor: 'transparent',
    borderRightWidth: 6,
    borderRightColor: 'transparent',
    borderBottomWidth: 6,
    borderBottomColor: 'white',
    shadowColor: Colors.steel,
    shadowOpacity: 1,
    shadowRadius: 0,
    shadowOffset: { width: 0, height: -1 },
  },
  text: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '600',
    textAlign: 'center',
    color: Colors.background,
    fontSize: 15,
    padding: 10,
  },

  /* Image Edit Only */

  imageEditContainer: {
    height: 200,
    width: 200,
    marginTop: -150,
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 30,
  },
  imageEditIconContainer: {
    height: 95,
    width: 95,
    borderWidth: 3,
    borderColor: Colors.snow,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.grey,
  },
  imageEditIconCamera: {},
  imageEditIconBullseye: {
    marginBottom: -10,
  },
  imageEditIconPointer: {
    backgroundColor: 'transparent',
    marginRight: -8,
  },
  imageEditText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '400',
    fontSize: 16,
    color: Colors.snow,
    marginTop: 10,
  },
  imageEditButton: {
    height: 36,
    borderRadius: 16,
    paddingHorizontal: 10,
  },
  imageEditButtonText: {
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    fontSize: 16,
  },
})
