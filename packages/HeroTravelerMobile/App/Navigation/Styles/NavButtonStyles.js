import {Colors, Fonts} from '../../Shared/Themes/'
import { isIPhoneX } from '../../Themes/Metrics'

export default {
  navButtonText: {
    color: Colors.red,
    fontFamily: Fonts.type.montserrat,
    fontSize: 16,
    padding: 5,
    paddingTop: 0,
  },
  touchableOpacity: {
    flex:1,
    flexDirection: 'row',
  },
  image: {
    height: 21,
    width: 13,
    marginTop: isIPhoneX() ? 15 : 0,
  },
}
