import React, {Component} from 'react'
import {Route} from 'react-router-dom'

import Session from '../Containers/Session'

import Header from '../Containers/Header'

import Home from '../Components/Home'

import AuthChecker from '../Containers/AuthChecker'

class AppRoot extends Component {
  render() {
    return (
      <AuthChecker>
        <Header />
        {/*<Session /> */}
        <Route exact path='/' component={Home} />
      </AuthChecker>
    )
  }
}

export default AppRoot
