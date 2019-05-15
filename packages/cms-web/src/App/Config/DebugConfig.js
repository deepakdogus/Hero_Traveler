const isDev = process.env.NODE_ENV === 'development'

export default {
  useFixtures: false,
  ezLogin: false,
  yellowBox: isDev,
  reduxLogging: isDev,
  includeExamples: isDev,
  useReactotron: isDev,
}
