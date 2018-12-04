import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import Loadable from 'react-loadable'

import Session from './Session'

import AuthRoute from './AuthRoute'
import Header from './Header'

const Explore = Loadable({
  loader: () => import('./Explore'),
  loading: null,
  delay: 300,
})

const Category = Loadable({
  loader: () => import('./Category'),
  loading: null,
  delay: 300,
})

const Feed = Loadable({
  loader: () => import('./Feed'),
  loading: null,
  delay: 300,
})

const SignupSocial = Loadable({
  loader: () => import('./Signup/SignupSocial'),
  loading: null,
  delay: 300,
})

const SignupTopics = Loadable({
  loader: () => import('./Signup/SignupTopics'),
  loading: null,
  delay: 300,
})

const EditTopics = Loadable({
  loader: () => import('./EditProfile/EditTopics'),
  loading: null,
  delay: 300,
})

const CreateGuide = Loadable({
  loader: () => import('./CreateGuide'),
  loading: null,
  delay: 300,
})

const Story = Loadable({
  loader: () => import('./Story'),
  loading: null,
  delay: 300,
})

const Guide = Loadable({
  loader: () => import('./Guide'),
  loading: null,
  delay: 300,
})

const EditStory = Loadable({
  loader: () => import('./EditStory'),
  loading: null,
  delay: 300,
})

const Profile = Loadable({
  loader: () => import('./Profile'),
  loading: null,
  delay: 300,
})

const Search = Loadable({
  loader: () => import('./Search'),
  loading: null,
  delay: 300,
})

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
        <AuthRoute path='/profile/editTopics' component={EditTopics} />
        <AuthRoute path='/edit/guide/:guideId' component={CreateGuide} />
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
