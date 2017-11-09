import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'

import SessionActions from '../Shared/Redux/SessionRedux'

const defaultExpiration = 500

function addToken(key, cookies, tokens){
  const token = cookies[key]
  if (!token) return
  const name = key.split('_')[1]
  const formattedToken = {
    value: token,
    type: name,
  }
  // unable to retrieve expire date from cookie so setting it short so it'll refresh automatically
  if (name === 'access') formattedToken.expiresIn = defaultExpiration
  tokens.push(formattedToken)
}

function isNewToken(oldTokenOfType, token) {
  return !oldTokenOfType || (oldTokenOfType && oldTokenOfType.value !== token.value && token.expiresIn !== defaultExpiration)
}

class Session extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }

  componentDidMount() {
    const {userId, retrievedCookies} = this.props
    const tokens = []
    addToken('session_access', retrievedCookies, tokens)
    addToken('session_refresh', retrievedCookies, tokens)
    this.props.resumeSession(userId, tokens)
  }

  componentWillReceiveProps(nextProps) {
    const {cookies, tokens} = this.props

    let oldTokensObject = {}
    if (tokens) {
      tokens.reduce((obj, token) => {
        obj[token.type] = token
        return obj
      }, oldTokensObject)
    }

    if (nextProps.tokens) {
      nextProps.tokens.forEach(token => {
        const oldTokenOfType = oldTokensObject[token.type]
        // checking if we have a new token
        if (isNewToken(oldTokenOfType, token)){
          const name = `session_${token.type}`
          const currentDate = new Date()
          const expiresIn = token.expiresIn || 100000
          const expires = new Date(currentDate.valueOf() + expiresIn)
          // refresh token should not expire
          const options = token.type === 'refresh' ? { } : { expires }
          cookies.set(name, token.value, options)
        }
      })
    }
  }

  render() {
    return (
      <div>
        {this.props.children}
      </div>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    userId: state.session.userId,
    tokens: state.session.tokens,
    retrievedCookies: ownProps.cookies.getAll(),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resumeSession: (userId, tokens) => dispatch(SessionActions.resumeSession(userId, tokens)),
  }
}

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Session))
