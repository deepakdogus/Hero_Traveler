import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.lightGreyAreas,
  },
  separator: {
    height: 35,
  },
  inputContainer: {
    height: 50,
    backgroundColor: Colors.snow,
  },
  input: {
    padding: Metrics.baseMargin,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 15,
    color: '#757575',
    fontWeight: '300',
    flexGrow: 2,
    marginLeft: Metrics.baseMargin,
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.navBarText,
    backgroundColor: Colors.snow,
  },
  buttonWrapper: {
    flexDirection:'row',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
 },
  submitButton: {
    width: '50%',
    height: 40,
    marginHorizontal: 0,
    marginLeft: 15,
  },
  cancelButton: {
    width: '25%',
    height: 40,
    borderWidth: 1,
    borderColor: Colors.blackoutTint,
    backgroundColor: Colors.transparent,
    marginHorizontal: 0,
  },
  errorWrapper: {
    textAlign: 'center',
  },
  error: {
    color: Colors.errorRed,
    fontSize: 12,
  },
  spinner: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
})
