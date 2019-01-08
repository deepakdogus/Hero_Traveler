import { Dimensions, Platform, PixelRatio } from 'react-native'

const { width, height } = Dimensions.get('window')

export const isIPhoneX = () =>
  Platform.OS === 'ios'
  && (isIPhoneXSize({ width, height }) || isIPhoneXrSize({ width, height }))

export const isIPhoneXSize = dim => dim.height == 812 || dim.width == 812

// iPhone Xr and Xs Max have heights of 896
export const isIPhoneXrSize = dim => dim.height == 896 || dim.width == 896

// for now these are the same, but future designs may need different heights
// rec X nav bar height: 88,
// rec pre-X nav bar height: 79
// rec android: 60
const getNavBarHeight = () => {
  if (Platform.OS === 'ios' && isIPhoneX()) return 60
  return 60
}

const getTabBarHeight = () => {
  if (Platform.OS === 'ios' && isIPhoneX()) return 83
  return 49
}

// Used via Metrics.baseMargin
const mobileMetrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height + (isIPhoneX() ? 50 : 0) : width,
  navBarHeight: getNavBarHeight(),
  tabBarHeight: getTabBarHeight(),
  pixelRatio: PixelRatio.get(),
  feedMargin: 92.8,
}

export default mobileMetrics
