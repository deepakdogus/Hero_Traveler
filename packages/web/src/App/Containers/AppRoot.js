import React, {Component} from 'react'
import {ThemeProvider} from 'styled-components'
import {Route, BrowserRouter as Router} from 'react-router-dom'

import themes from '../Shared/Themes'
import background from '../Shared/Images/BG.png'
import Header from '../Components/Header'
import HeaderImageWrapper from '../Components/HeaderImageWrapper'

import Feed from './Feed'
import Story from './Story'
import SignupSocial from './Signup/SignupSocial';
import SignupTopics from './Signup/SignupTopics';
import Profile from './Profile'

class AppRoot extends Component {
  render() {
    return (
      <Router>
        <ThemeProvider theme={themes}>
          <div>
            <HeaderImageWrapper backgroundImage={background}>
              <Header />
            </HeaderImageWrapper>
            <Route exact path='/' component={Feed} />
            <Route path='/signup/social' component={SignupSocial} />
            <Route path='/signup/topics' component={SignupTopics} />
            <Route path='/story/:storyId' component={Story} />
            <Route path='/profile/:userId' component={Profile} />
          </div>
        </ThemeProvider>
      </Router>
    )
  }
}

export default AppRoot
