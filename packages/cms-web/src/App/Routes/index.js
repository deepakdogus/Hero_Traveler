import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import styled from 'styled-components'

import Session from '../Containers/Session'
import Header from '../Containers/Header'
import Home from '../Components/Home'
import UsersPage from '../Containers/Users/List'
import EditUserPage from '../Containers/Users/Edit'
import AuthChecker from '../Containers/AuthChecker'

const RouterWrapper = styled.div`
  padding: 30px;
`

class AppRoot extends Component {
  render() {
    return (
      <div>
        <Session /> 
        <AuthChecker>
          <Header />
          <RouterWrapper>
            <Route exact path='/' component={Home} />
            <Route exact path='/users' component={UsersPage} />
            <Route exact path='/users/:id' component={EditUserPage} />
          </RouterWrapper>
        </AuthChecker>
      </div>
    )
  }
}

export default AppRoot
