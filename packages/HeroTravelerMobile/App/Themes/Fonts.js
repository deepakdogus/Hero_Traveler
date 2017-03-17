const type = {
  base: 'Avenir-Book',
  bold: 'Avenir-Black',
  emphasis: 'HelveticaNeue-Italic',
  source: "SourceSansPro-Regular",
  montserrat: "Montserrat-Medium",
  crimson: "CrimsonText-Roman"
}

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 21,
  h6: 19,
  input: 18,
  regular: 17,
  medium: 14,
  small: 12,
  tiny: 8.5
}

const style = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1
  },
  h2: {
    fontWeight: 'bold',
    fontSize: size.h2
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6
  },
  title: {
    fontFamily: type.base,
    fontSize: 25
  },
  instructions: {
    color: '#9e9e9e',
    fontSize: 16,
    fontWeight: '300'
  },
  tos: {
    color: '#9e9e9e',
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: .7
  },
  inputLabels: {
    fontWeight: '300',
    letterSpacing: .7,
    fontSize: 16
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium
  }
}

export default {
  type,
  size,
  style
}
