import {Dimensions, Platform, PixelRatio} from 'react-native'

const { width, height } = Dimensions.get('window')

// Used via Metrics.baseMargin
const mobileMetrics = {
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  navBarHeight: (Platform.OS === 'ios') ? 79 : 69,
  pixelRatio: PixelRatio.get(),
}

export default mobileMetrics
