import React, {Component} from 'react'
import {Route} from 'react-router-dom'

import Session from './Session'

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


class AppRoot extends Component {
  render() {
    return (
      <div>
        <Session />
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
    )
  }
}

export default AppRoot
