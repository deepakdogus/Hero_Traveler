import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import Loadable from 'react-loadable'

import Session from '../Shared/Web/Containers/Session'

import AuthRoute from './AuthRoute'

const Loading = () => null

const Header = Loadable({
  loader: () => import('./Header'),
  loading: Loading,
  delay: 300,
})

const Explore = Loadable({
  loader: () => import('./Explore'),
  loading: Loading,
  delay: 300,
})

const ExploreItems = Loadable({
  loader: () => import('./ExploreItems'),
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

const SignupAdditionalInfo = Loadable({
  loader: () => import('./Signup/SignupAdditionalInfo'),
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

const applyRedirect = () => {
  window.location = 'https://goo.gl/forms/dS7QxL3yOgflB5ZX2'
  return null
}

class AppRoot extends Component {
  render() {
    return (
      <div>
        <Header />
        <Session />
        <Route
          exact
          path="/category/:categoryId"
          component={ExploreItems}
        />
        <Route
          exact
          path="/channel/:userId"
          component={ExploreItems}
        />
        <AuthRoute
          path="/signup/social"
          component={SignupSocial}
        />
        <AuthRoute
          path="/signup/topics"
          component={SignupTopics}
        />
        <AuthRoute
          path="/signup/info"
          component={SignupAdditionalInfo}
        />
        <AuthRoute
          path="/profile/editTopics"
          component={EditTopics}
        />
        <AuthRoute
          path="/edit/guide/:guideId"
          component={CreateGuide}
        />
        <Route
          path="/story/:storyId"
          component={Story}
        />
        <Route
          path="/guide/:guideId"
          component={Guide}
        />
        <AuthRoute
          path="/editStory/:storyId"
          component={EditStory}
        />
        <Route
          exact
          path="/results/:country/:lat/:lng"
          component={SearchResults}
        />
        <Route
          exact
          path="/results/:country/:lat/:lng/:seeAllType"
          component={SearchResults}
        />
        <Switch>
          <Route
            exact
            path="/"
            component={Explore}
          />
          <Route
            path="/apply"
            component={applyRedirect}
          />
          <Route
            path="/search"
            component={Search}
          />
          <AuthRoute
            path="/feed"
            component={Feed}
          />
          <Route
            path="/:username"
            component={Profile}
          />
        </Switch>
      </div>
    )
  }
}

export default AppRoot
