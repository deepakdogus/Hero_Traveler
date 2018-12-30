import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Shared/Themes/'

const third = (1 / 3) * (Metrics.screenHeight - Metrics.navBarHeight * 2)

export default StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'white',
    borderTopWidth: 20,
    borderTopColor: Colors.background,
  },
  containerWithNavbar: {
    ...ApplicationStyles.screen.containerWithNavbar,
  },
  contentContainer: {
    flex: 1,
  },
  errorButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.section,
    zIndex: 100,
  },
  imageMenuToggleButton: {
    flex: 1,
  },
  spaceView: {
    height: third,
  },
  loaderText: {
    color: 'white',
    fontSize: 18,
    fontFamily: Fonts.type.montserrat,
  },
  titlesWrapper: {
    marginHorizontal: 20,
  },
  titleInput: {
    color: Colors.background,
    fontSize: 30,
    fontFamily: Fonts.type.montserrat,
    fontWeight: '600',
    lineHeight: 33,
    marginTop: 15,
    paddingTop: 0,
  },
  description: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '400',
    letterSpacing: 0.7,
    color: Colors.grey,
    fontSize: 18,
    marginTop: 5,
    lineHeight: 28,
    height: 28,
  },
  coverCaption: {
    marginTop: 10,
    marginBottom: 0,
    minHeight: 20,
  },
  divider: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: Colors.dividerGrey,
    marginTop: 10,
    marginBottom: 15,
  },
  videoIconImage: {
    tintColor: 'gray',
    height: 31,
    width: 51,
  },
  colorOverLay: {
    backgroundColor: Colors.windowTint,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  addTitleView: {
    height: third,
    justifyContent: 'center',
  },
  navBarStyle: {
    height: Metrics.navBarHeight - 10,
    paddingTop: 0,
  },
  navBarRightTextStyle: {
    paddingRight: 10,
  },
  angleDownIcon: {
    height: 20,
    alignItems: 'center',
    marginVertical: Metrics.baseMargin / 2,
  },
  editorWrapper: {
    backgroundColor: Colors.snow,
  },
  loadingText: {
    color: Colors.white,
  },
  loading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  trackingToolbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: Metrics.screenWidth,
  },
  toolbarAvoiding: {
    height: Metrics.editorToolbarHeight,
  },
  modalTitle: {
    textAlign: 'center',
    fontSize: 19,
    fontWeight: '600',
    paddingTop: 17.5,
  },
  modalMessage: {
    textAlign: 'center',
    paddingHorizontal: 17.5,
    paddingBottom: 10,
  },
  modalBtnWrapper: {
    flexDirection: 'row',
    height: 50,
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: Colors.lightGrey,
  },
  modalBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  modalBtnLeft: {
    borderRightWidth: 0.5,
    borderRightColor: Colors.lightGrey,
  },
  modalBtnText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#007AFF',
    lineHeight: 50,
    width: 100,
  },
  failModalMessage: {
    marginBottom: 40,
  },
  slideToDeleteTooltip: {
    position: 'absolute',
    top: 55,
    right: 14,
    backgroundColor: Colors.backgroundOpaque,
    borderRadius: 5,
    paddingHorizontal: 30,
    paddingVertical: 8,
  },
  slideToDeleteTooltipArrow: {
    position: 'absolute',
    bottom: -30,
    right: 70,
    height: 30,
    borderTopWidth: 14,
    borderTopColor: Colors.backgroundOpaque,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
  slideToDeleteTooltipUpArrow: {
    position: 'absolute',
    top: -30,
    right: 70,
    height: 30,
    borderBottomWidth: 14,
    borderBottomColor: Colors.backgroundOpaque,
    borderLeftWidth: 8,
    borderLeftColor: 'transparent',
    borderRightWidth: 8,
    borderRightColor: 'transparent',
  },
})

export const customStyles = StyleSheet.create({
  unstyled: {
    fontSize: 18,
    color: Colors.grey,
    fontWeight: '400',
  },
  atomic: {
    fontSize: 15,
    color: Colors.grey,
  },
  link: {
    color: '#c4170c',
    fontWeight: '600',
    textDecorationLine: 'none',
  },
  'header-one': {
    fontSize: 21,
    fontWeight: '600',
    color: '#1a1c21',
  },
})

export const modalWrapperStyles = {
  height: 140,
  width: 270,
  borderRadius: 15,
  padding: 0,
}
