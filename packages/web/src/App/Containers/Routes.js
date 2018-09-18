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
import EditStory from './EditStory'
import SignupSocial from './Signup/SignupSocial'
import SignupTopics from './Signup/SignupTopics'
import Profile from './Profile'
import Header from './Header'
import Guide from './Guide'
import CreateGuide from './CreateGuide'

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
        <AuthRoute path='/guide/edit/:guideId' component={CreateGuide} />
        <Route path='/story/:storyId' component={Story} />
        <Route path='/guide/:guideId' component={Guide} />
        <AuthRoute path='/editStory/:storyId' component={EditStory} />
        <Route path='/profile/:userId/view' component={Profile} />
        <AuthRoute path='/profile/:userId/edit' component={Profile}/>
        <Route path='/search' component={Search} />
      </div>
    )
  }
}

export default AppRoot
