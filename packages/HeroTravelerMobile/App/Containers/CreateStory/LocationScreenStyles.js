import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'column',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
    marginHorizontal: Metrics.doubleBaseMargin,
    flexDirection: 'column'
  },
  cancelBtn: {
    flex: 1,
    height: Metrics.navBarHeight,
    flexDirection: 'row',
    paddingHorizontal: Metrics.doubleBaseMargin,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  cancelBtnText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.red,
    fontWeight: '600',
    letterSpacing: .7,
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
    paddingVertical: 5,
  },
  text: {
    fontWeight: '300',
    fontSize: 14,
    color: Colors.grey,
  },
  boldText: {
    fontFamily: Fonts.type.sourceSansPro,
    fontWeight: '400',
    letterSpacing: .7,
    fontSize: 16,
    color: Colors.background,
  },
  formWrapper: {
    flex: .2,
    flexDirection: 'row',
    position: 'relative',
  },
  textInput: {
    flexGrow: 1,
    marginRight: 60,
    color: Colors.navBarText,
  },
  textInputWrapper: {
    flexGrow: .7,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
    marginVertical: Metrics.baseMargin / 2
  },
  spinner: {
    margin: Metrics.section
  }
})