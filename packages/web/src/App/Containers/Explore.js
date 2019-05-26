import _ from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ExploreHeader from '../Components/ExploreHeader'
import Footer from '../Components/Footer'
import ExploreGrid from '../Components/ExploreGrid'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import UserActions from '../Shared/Redux/Entities/Users'
import TabBar from '../Components/TabBar'
import getCatagoriesOrChannels from '../Shared/Lib/channelAndCategoryRender'

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 0 7%;
  text-align: center;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const tabTypes = {
  channels: 'CHANNELS',
  categories: 'CATEGORIES',
}

const tabBarTabs = [tabTypes.channels, tabTypes.categories]

class Explore extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
    loadChannelUsers: PropTypes.func,
    loadUsers: PropTypes.func,
    reroute: PropTypes.func,
    channels: PropTypes.array,
    users: PropTypes.object,
  }

  state = {
    activeTab: tabTypes.channels,
  }

  componentDidMount() {
    this.props.loadCategories()
    this.props.loadChannelUsers()
    this.props.loadUsers()
  }

  _navToCategory = (categoryId) => {
    this.props.reroute(`/category/${categoryId}`)
  }

  _navToChannel = (userId) => {
    this.props.reroute(/*`/profile/${userId}/view`*/`/category/${userId}`)
  }

  onClickTab = event => {
    let tab = event.target.innerHTML
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab })
  }

  getEntitiesByType = () => {
    const {activeTab} = this.state
    const {channels, users, categories} = this.props

    return getCatagoriesOrChannels(activeTab, channels, users, categories, tabTypes)
  }

  render() {
    const exploreItems = _.values(this.getEntitiesByType())
    const { activeTab } = this.state
    return (
      <Wrapper>
        <ExploreHeader/>
        <TabBar
          tabs={tabBarTabs}
          activeTab={activeTab}
          onClickTab={this.onClickTab}
        />
        <ContentWrapper>
            <ExploreGrid
              categories={exploreItems}
              onClickExploreItem={activeTab === tabTypes.channels 
                ? this._navToChannel
                : this._navToCategory}
            />
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
  } = state.entities.categories

  return {
    channels: state.entities.users.channelsByID,
    users: state.entities.users.entities,
    categories,
    categoriesFetchStatus,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadUsers: () => dispatch(UserActions.loadUser()),
    loadChannelUsers: () => dispatch(UserActions.loadUsersChannels()),
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
