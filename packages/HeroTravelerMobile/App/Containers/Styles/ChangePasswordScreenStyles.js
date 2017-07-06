import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    backgroundColor: Colors.lightGreyAreas
  },
  separator: {
    height: 35,
  },
  inputContainer: {
    height: 50,
    backgroundColor: Colors.snow
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
    marginLeft: Metrics.baseMargin
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.navBarText,
    backgroundColor: Colors.snow
  },
  buttonWrapper: {
    flexDirection:'row',
    flexWrap:'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40
 },
  submitButton: {
    width: '50%',
    height: Metrics.tabBarHeight/1.4,
    borderRadius: 10,
    marginLeft: '%',
  },
  cancelButton: {
    width: '25%',
    height: Metrics.tabBarHeight/1.4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.blackoutTint,
    backgroundColor: Colors.transparent,
    marginLeft: '2%',
  },
  error: {
    color: Colors.errorRed,
    fontSize: 12,
    textAlign: 'right'
  },    
})
