import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import styled from 'styled-components'

import AuthChecker from '../Containers/AuthChecker'
import Session from '../Shared/Web/Containers/Session'
import Header from '../Containers/Header'
import Home from '../Containers/Home'
import UsersPage from '../Containers/Users/UsersList'
import EditUserPage from '../Containers/Users/UsersEdit'
import CategoriesPage from '../Containers/Categories/CategoriesList'
import EditCategoryPage from '../Containers/Categories/CategoriesEdit'
import CreateCategoryPage from '../Containers/Categories/CategoriesCreate'
import StoriesPage from '../Containers/Stories/StoriesList'
import EditStoryPage from '../Containers/Stories/StoriesEdit'
import GuidesPage from '../Containers/Guides/GuidesList'
import EditGuidePage from '../Containers/Guides/GuidesEdit'
import StoriesInCategory from '../Containers/StoriesInCategory/StoriesInCategoryList'
import GuidesInCategory from '../Containers/GuidesInCategory/GuidesInCategoryList'

const RouterWrapper = styled.div`
  padding: 30px;
`

class AppRoot extends Component {
  render() {
    return (
      <div>
        <Session /> 
        <AuthChecker>
          <Header />
          <RouterWrapper>
            <Route exact path='/' component={Home} />
            <Route exact path='/users' component={UsersPage} />
            <Route exact path='/users/:id' component={EditUserPage} />
            <Route exact path='/categories' component={CategoriesPage} />
            <Route exact path='/newCategory' component={CreateCategoryPage} />
            <Route exact path='/categories/:id' component={EditCategoryPage} />
            <Route exact path='/stories' component={StoriesPage} />
            <Route exact path='/stories/:id' component={EditStoryPage} />
            <Route exact path='/guides' component={GuidesPage} />
            <Route exact path='/guides/:id' component={EditGuidePage} />
            <Route
              exact
              path='/categories/:categoryId/stories'
              component={StoriesInCategory}
            />
            <Route
              exact
              path='/categories/:categoryId/guides'
              component={GuidesInCategory}
            />
          </RouterWrapper>
        </AuthChecker>
      </div>
    )
  }
}

export default AppRoot
