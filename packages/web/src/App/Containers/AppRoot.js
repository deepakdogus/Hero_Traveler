import React, {Component} from 'react'
import {ThemeProvider} from 'styled-components'
import { Provider } from 'react-redux'
import {Route, BrowserRouter as Router} from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import createStore from '../Shared/Redux'

import themes from '../Shared/Themes'

import Category from './Category'
import Explore from './Explore'
import Feed from './Feed'
import Story from './Story'
import Search from './Search'
import CreateStory from './CreateStory'
import SignupSocial from './Signup/SignupSocial';
import SignupTopics from './Signup/SignupTopics';
import Profile from './Profile'

const store = createStore()

class AppRoot extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <MuiThemeProvider>
            <ThemeProvider theme={themes}>
              <div>
                <Route exact path='/' component={Explore} />
                <Route exact path='/category/:categoryId' component={Category} />
                <Route exact path='/feed' component={Feed} />
                <Route path='/signup/social' component={SignupSocial} />
                <Route path='/signup/topics' component={SignupTopics} />
                <Route path='/story/:storyId' component={Story} />
                <Route path='/createStory' component={CreateStory} />
                <Route path='/profile/:userId/view' component={Profile} />
                <Route path='/profile/:userId/edit' component={Profile}/>
                <Route path='/search' component={Search} />
              </div>
            </ThemeProvider>
          </MuiThemeProvider>
        </Router>
      </Provider>
    )
  }
}

export default AppRoot
