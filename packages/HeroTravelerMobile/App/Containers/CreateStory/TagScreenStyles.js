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
  selectedTagRow: {
    backgroundColor: Colors.lightGreyAreas,
    marginBottom: Metrics.baseMargin / 5,
  },
  removeTagIcon: {
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
  },
  tooltipWrapper: {
    position: 'absolute',
    zIndex: 5,
    top: 50,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    flex: 1,
    justifyContent: 'flex-start',
  },
  defaultTags:{},
  tooltipTextView: {
    height: 38,
    width: 150,
    padding: 0,
    borderRadius: 5,
    backgroundColor: 'white',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: .2,
    shadowRadius: 30,
    left: 20,
    top: 30,
  }
})
