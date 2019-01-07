import { StyleSheet } from 'react-native'
import { ApplicationStyles, Fonts, Colors, Metrics } from '../../Shared/Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  root: {
    flex: 1,
    backgroundColor: Colors.snow,
    marginHorizontal: Metrics.doubleBaseMargin,
  },
  wrapper: {
    flex: 1,
    position: 'relative',
  },
  title: {
    ...Fonts.style.title,
    fontSize: 16,
    textAlign: 'center',
    marginVertical: Metrics.section,
  },
  fieldWrapper: {
    borderBottomColor: Colors.navBarText,
    borderBottomWidth: 1,
    marginVertical: Metrics.baseMargin,
    flexDirection: 'row',
  },
  fieldLabel: {
    marginBottom: Metrics.baseMargin / 2,
    fontSize: 14,
    fontWeight: '500',
  },
  fieldLabelLong: {
    flexGrow: 1,
    width: '100%',
    marginBottom: Metrics.baseMargin / 2,
    fontSize: 14,
  },
  fieldIcon: {
    marginRight: Metrics.doubleBaseMargin,
    width: 18,
  },
  inputStyle: {
    flexGrow: 1,
    maxWidth: Metrics.screenWidth - 2 * Metrics.doubleBaseMargin - 40, // metrics of other elements in location text area
    color: Colors.background,
    fontSize: 16,
    marginBottom: 10,
    height: 30,
  },
  tagStyle: {
    flexGrow: 1,
    fontSize: 16,
    minHeight: 30,
  },
  tagStyleText: {
    fontSize: 16,
    color: Colors.background,
    marginBottom: 20,
  },
  tagPlaceholder: {
    color: Colors.navBarText,
  },
  longInput: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    flexGrow: 1,
    minHeight: 30,
  },
  longInputText: {
    flexGrow: 1,
    fontSize: 16,
    color: Colors.background,
    marginBottom: 20,
  },
  travelTipsWrapper: {
    marginTop: Metrics.baseMargin * 2,
    marginBottom: Metrics.baseMargin,
    flexDirection: 'column',
  },
  travelTipsPreview: {
    flexGrow: 1,
    width: '100%',
  },
  travelTipsPreviewText: {
    borderWidth: 1,
    borderColor: Colors.navBarText,
    padding: Metrics.baseMargin,
    minHeight: 90,
  },
  travelTipsPreviewTextDimmed: {
    color: Colors.grey,
  },
  currency: {
    flexShrink: 1,
    fontSize: 14,
    color: Colors.background,
    marginBottom: 20,
    marginRight: 2,
  },
  radioGroup: {
    flexDirection: 'row',
    flex: 1,
  },
  radio: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Metrics.baseMargin,
  },
  radioBtnOuter: {
    borderRadius: 100,
    width: 15,
    height: 15,
    backgroundColor: Colors.snow,
    borderWidth: 1.5,
    borderColor: Colors.navBarText,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioBtnInner: {
    borderRadius: 100,
    width: 7,
    height: 7,
    backgroundColor: Colors.snow,
  },
  radioBtnActiveBorder: {
    borderColor: Colors.redHighlights,
  },
  radioBtnActiveBackground: {
    backgroundColor: Colors.redHighlights,
  },
  radioText: {
    marginLeft: Metrics.baseMargin,
    fontWeight: '500',
    fontSize: 16,
  },
  draftButton: {
    borderColor: Colors.red,
    borderWidth: 1,
    backgroundColor: Colors.clear,
  },
  draftButtonText: {
    color: Colors.red,
  },
  loader: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  dateWrapper: {
    position: 'absolute',
    top: 250,
    left: 40,
    elevation: 100,
  },
  dateView: {
    backgroundColor: 'white',
    height: 300,
    width: 300,
  },
  videoDescriptionWrapper: {
    borderColor: Colors.navBarText,
    borderWidth: 1,
    padding: Metrics.baseMargin,
    marginBottom: Metrics.section,
  },
  videoDescription: {
    height: 100,
    color: Colors.background,
    fontSize: 16,
  },
  errorButton: {
    position: 'absolute',
    top: 100,
    left: 0,
    right: 0,
    marginVertical: Metrics.baseMargin,
    marginHorizontal: Metrics.section,
    zIndex: 100,
    padding: Metrics.section,
  },
})
