import React, {Component} from 'react'
import styled, {ThemeProvider} from 'styled-components'
import {Route, BrowserRouter as Router} from 'react-router-dom'

import themes from '../Shared/Themes'
import background from '../Shared/Images/BG.png'
import Header from '../Components/Header'

import Feed from './Feed'
import Story from './Story.container'
import SignupSocial from './Signup/SignupSocial';

const TopContainer = styled.div`
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  height: 180px;
`

class AppRoot extends Component {
  render() {
    return (
      <Router>
        <ThemeProvider theme={themes}>
          <div>
            <TopContainer>
              <Header />
            </TopContainer>

            <Route exact path='/' component={Feed} />
            <Route path='/signup/social' component={SignupSocial} />
            <Route path='/story/:id' component={Story} />
          </div>
        </ThemeProvider>
      </Router>
    )
  }
}

export default AppRoot
