import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
    marginTop: isIPhoneX() ? Metrics.baseMargin * 3 : Metrics.baseMargin,
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'column',
  },
  doneBtn: {
    flex: 1,
    height: Metrics.navBarHeight,
    flexDirection: 'row',
    paddingHorizontal: Metrics.doubleBaseMargin,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  doneBtnText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.red,
  },
  formWrapper: {
    flex: 0.2,
    flexDirection: 'row',
    position: 'relative',
  },
  textInput: {
    flexGrow: 1,
    marginRight: 60,
  },
  textInputWrapper: {
    flexGrow: 0.7,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
    marginVertical: Metrics.baseMargin / 2,
  },
  spinner: {
    margin: Metrics.section,
  },
})
