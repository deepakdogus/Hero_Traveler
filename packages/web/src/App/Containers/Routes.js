import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import Loadable from 'react-loadable'

import Session from './Session'

import AuthRoute from './AuthRoute'
import Header from './Header'

const Loading = () => null

const Explore = Loadable({
  loader: () => import('./Explore'),
  loading: Loading,
  delay: 300,
})

const Category = Loadable({
  loader: () => import('./Category'),
  loading: Loading,
  delay: 300,
})

const Feed = Loadable({
  loader: () => import('./Feed'),
  loading: Loading,
  delay: 300,
})

const SignupSocial = Loadable({
  loader: () => import('./Signup/SignupSocial'),
  loading: Loading,
  delay: 300,
})

const SignupTopics = Loadable({
  loader: () => import('./Signup/SignupTopics'),
  loading: Loading,
  delay: 300,
})

const EditTopics = Loadable({
  loader: () => import('./EditProfile/EditTopics'),
  loading: Loading,
  delay: 300,
})

const CreateGuide = Loadable({
  loader: () => import('./CreateGuide'),
  loading: Loading,
  delay: 300,
})

const Story = Loadable({
  loader: () => import('./Story'),
  loading: Loading,
  delay: 300,
})

const Guide = Loadable({
  loader: () => import('./Guide'),
  loading: Loading,
  delay: 300,
})

const EditStory = Loadable({
  loader: () => import('./EditStory'),
  loading: Loading,
  delay: 300,
})

const Profile = Loadable({
  loader: () => import('./Profile'),
  loading: Loading,
  delay: 300,
})

const Search = Loadable({
  loader: () => import('./Search'),
  loading: Loading,
  delay: 300,
})

const SearchResults = Loadable({
  loader: () => import('./SearchResults'),
  loading: Loading,
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
        <Route exact path='/results/:country/:lat/:lng' component={SearchResults} />
        <Route exact path='/results/:country/:lat/:lng/:seeAllType' component={SearchResults} />
      </div>
    )
  }
}

export default AppRoot
