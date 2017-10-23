import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'

import SessionActions from '../Shared/Redux/SessionRedux'

function addToken(key, cookies, tokens){
  const token = cookies[key]
  if (!token) return
  const name = key.split('_')[1]
  const formattedToken = {
    value: token,
    type: name,
  }
  if (name === 'access') formattedToken.expiresIn = 500
  tokens.push(formattedToken)
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
    // unable to retrieve expire date from cookie so setting so short it'll refresh automatically
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
        if (!oldTokenOfType || (oldTokenOfType && oldTokenOfType.value !== token.value)){
          const name = `session_${token.type}`
          const currentDate = new Date()
          const expiresIn = token.expiresIn || 100000
          const expires = new Date(currentDate.valueOf() + expiresIn)
          const options = { expires }
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
