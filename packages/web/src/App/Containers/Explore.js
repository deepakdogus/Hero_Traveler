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

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background};
`

const ExploreText = styled(CenteredText)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 30px;
  letter-spacing: .6px;
  padding: 50px 0px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 18px;
    padding: 30px 0px;
    margin: 0;
  }
`

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
  categories: 'CATEGORIES'
}

const tabBarTabs = [tabTypes.channels, tabTypes.categories]

class Explore extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
    reroute: PropTypes.func,
  }

  state = {
    activeTab: tabTypes.channels
  }

  componentDidMount() {
    this.props.loadCategories()
    this.props.loadUsersThatAreChannels()
    this.props.loadUsers()
  }

  _navToCategory = (categoryId) => {
    this.props.reroute(`/category/${categoryId}`)
  }

  _navToChannel = (userId) => {
    console.log(userId, 'userId')
    this.props.reroute(`/profile/${userId}/view`)
  }

  onClickTab = event => {
    let tab = event.target.innerHTML
    if(this.state.activeTab !== tab) this.setState({activeTab: tab})
  }

  getEntitiesByType = () => {
    const {activeTab} = this.state
    const {channels, users, categories} = this.props
    const filteredChannelsThatAreUsers = {}
    if(activeTab === tabTypes.channels){
      for(let i = 0; i < channels.length; i++){
        if(users[channels[i]]){
          filteredChannelsThatAreUsers[users[channels[i]].id] = users[channels[i]]
        }
      }
    }
     switch(activeTab){
      case tabTypes.categories:
        return categories
      case tabTypes.channels:
        return filteredChannelsThatAreUsers
      default:
        return []
    }
  }

  render() {
    const categoriesArray = this.getEntitiesByType()
    const {activeTab} = this.state
    return (
      <Wrapper>
        <ExploreHeader/>
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <ContentWrapper>
            <ExploreGrid
              categories={categoriesArray}
              onClickCategory={this.state.activeTab === tabTypes.channels ? this._navToChannel : this._navToCategory}
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
    loadUsersThatAreChannels: () => dispatch(UserActions.loadUsersChannels()),
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
