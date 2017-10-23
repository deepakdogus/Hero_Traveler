import React, {Component} from 'react'
import { connect } from 'react-redux'
import { withCookies, Cookies } from 'react-cookie'
import { instanceOf } from 'prop-types'
import _ from 'lodash'

import SessionActions from '../Shared/Redux/SessionRedux'

class Session extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  }

  componentDidMount() {
    const {userId, accessToken} = this.props
    this.props.resumeSession(userId, accessToken)
  }

  componentWillReceiveProps(nextProps) {
    const {cookies, tokens} = this.props
    if (_.keys(tokens).length !== _.keys(nextProps.tokens).length){
      _.keys(nextProps.tokens).forEach(key => {
        const token = nextProps.tokens[key]
        const name = `session_${token.type}`
        const options = {
          expires: token.expires
        }
        cookies.set(name, token.value, options)
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
    accessToken: ownProps.cookies.get('session_access'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    resumeSession: (userId, tokens) => dispatch(SessionActions.resumeSession(userId, tokens)),
  }
}

export default withCookies(connect(mapStateToProps, mapDispatchToProps)(Session))
