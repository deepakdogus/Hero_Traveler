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
  doneBtn: {
    flex: 1,
    height: Metrics.navBarHeight,
    flexDirection: 'row',
    paddingHorizontal: Metrics.doubleBaseMargin,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  doneBtnText: {
    fontFamily: Fonts.type.montserrat,
    color: Colors.red,
  },
  row: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas
  },
  selectedCategoryRow: {
    backgroundColor: Colors.lightGreyAreas,
    marginBottom: Metrics.baseMargin / 5,
  },
  removeCategoryIcon: {
    marginTop: 2,
    color: Colors.background
  },
  formWrapper: {
    flex: .2,
    flexDirection: 'row',
    position: 'relative',
  },
  textInput: {
    flexGrow: 1,
    marginRight: 60
  },
  textInputWrapper: {
    flexGrow: .7,
    height: 35,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGreyAreas,
    marginVertical: Metrics.baseMargin / 2
  },
  addBtn: {
    width: 60,
    height: 40,
    position: 'absolute',
    left: -60,
    flexDirection: 'row',
    alignItems: 'center',
  },
  addText: {
    flex: 1,
    textAlign: 'center'
  },
  spinner: {
    margin: Metrics.section
  }
})