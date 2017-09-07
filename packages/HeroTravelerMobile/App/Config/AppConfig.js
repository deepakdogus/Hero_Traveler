// Simple React Native specific changes

console.disableYellowBox = true

export default {
  // font scaling override - RN default is on
  allowTextFontScaling: true,
  cdnBaseUrl: __DEV__ ? 'https://res.cloudinary.com/di6rehjqx/' : 'https://res.cloudinary.com/rehash-studio/',
}
