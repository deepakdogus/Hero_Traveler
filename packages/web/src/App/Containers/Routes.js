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
import CreateStoryNew from './CreateStoryNew'
import SignupSocial from './Signup/SignupSocial'
import SignupTopics from './Signup/SignupTopics'
import Profile from './Profile'
import Header from './Header'

class AppRoot extends Component {
  render() {
    return (
      <div>
        <Header />
        <Session />
        <Route exact path='/' component={Explore} />
        <Route exact path='/category/:categoryId' component={Category} />
        <AuthRoute exact path='/feed' component={Feed} />
        <AuthRoute path='/signup/social' component={SignupSocial} />
        <AuthRoute path='/signup/topics' component={SignupTopics} />
        <Route path='/story/:storyId' component={Story} />
        <Route exact path='/createStory' component={CreateStory} />
        <AuthRoute path='/createStoryNew/:draftId' component={CreateStoryNew} />
        <Route path='/profile/:userId/view' component={Profile} />
        <AuthRoute path='/profile/:userId/edit' component={Profile}/>
        <Route path='/search' component={Search} />
      </div>
    )
  }
}

export default AppRoot
