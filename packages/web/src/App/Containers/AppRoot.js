import React, {Component} from 'react'
import {ThemeProvider} from 'styled-components'
import { Provider } from 'react-redux'
import {Route} from 'react-router-dom'
import {ConnectedRouter} from 'react-router-redux'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'

import createStore from '../Shared/Redux'
import {history} from '../Redux/Routes'

import themes from '../Shared/Themes'

import AuthRoute from './AuthRoute'
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
        <ConnectedRouter history={history}>
          <MuiThemeProvider>
            <ThemeProvider theme={themes}>
              <div>
                <Route exact path='/' component={Explore} />
                <Route exact path='/category/:categoryId' component={Category} />
                <AuthRoute exact path='/feed' component={Feed} />
                <AuthRoute path='/signup/social' component={SignupSocial} />
                <AuthRoute path='/signup/topics' component={SignupTopics} />
                <Route path='/story/:storyId' component={Story} />
                <AuthRoute path='/createStory' component={CreateStory} />
                <Route path='/profile/:userId/view' component={Profile} />
                <AuthRoute path='/profile/:userId/edit' component={Profile}/>
                <Route path='/search' component={Search} />
              </div>
            </ThemeProvider>
          </MuiThemeProvider>
        </ConnectedRouter>
      </Provider>
    )
  }
}

export default AppRoot
