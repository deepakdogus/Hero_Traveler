import Colors from './Colors'

const type = {
  base: 'Source Sans Pro',
  emphasis: 'Source Sans Pro',
  bold: 'Source Sans Pro',
  sourceSansPro: 'Source Sans Pro',
  crimsonText: 'Crimson Text',
  montserrat: 'Montserrat'
}

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 21,
  h6: 18,
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
    fontFamily: type.montserrat,
    letterSpacing: 1.05,
    fontSize: 25,
  },
  instructions: {
    color: Colors.signupGrey,
    fontSize: 16,
    fontFamily: type.sourceSansPro,
    letterSpacing: .7,
    fontWeight: '300'
  },
  tos: {
    color: Colors.signupGrey,
    fontSize: 13,
    fontWeight: '300',
    letterSpacing: .7
  },
  buttonText: {
    fontFamily: type.montserrat
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
