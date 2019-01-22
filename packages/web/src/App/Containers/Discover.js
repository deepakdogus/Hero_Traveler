import React, { Component } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ExploreHeader from '../Components/ExploreHeader'
import Footer from '../Components/Footer'
import TabBar from '../Components/TabBar'
import ExploreGrid from '../Components/ExploreGrid'
import DiscoverChannelsGrid from '../Components/DiscoverChannelsGrid'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import UserActions from '../Shared/Redux/Entities/Users'

const Wrapper = styled.div``

const ContentWrapper = styled.div`
  margin: 100px 7%;
  text-align: center;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const tabBarTabs = ['CHANNELS', 'CATEGORIES']

class Discover extends Component {
  static propTypes = {
    categories: PropTypes.object,
    channels: PropTypes.array,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
    loadChannels: PropTypes.func,
    reroute: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'CHANNELS',
    }
  }

  componentDidMount() {
    this.props.loadCategories()
    this.props.loadChannels()
  }

  _navToChannel = (channelId) => {
    this.props.reroute(`/channel/${channelId}`)
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML.split('&amp;').join('&')
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab })
  }

  render() {
    return (
      <Wrapper>
        <ExploreHeader/>
        <TabBar
          tabs={tabBarTabs}
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
        />
        <ContentWrapper>
          {this.state.activeTab === 'CHANNELS'
          && <DiscoverChannelsGrid
            channels={this.props.channels}
            onClickChannel={this._navToChannel}
             />
          }
          {this.state.activeTab === 'CATEGORIES'
          && <ExploreGrid
            categories={this.props.categories}
            onClickCategory={this._navToCategory}
             />
          }
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

  const { 
    channels,
  } = state.entities.users

  return {
    channels,
    categories,
    categoriesFetchStatus,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest({ featured: true })),
    loadChannels: () => dispatch(UserActions.fetchChannels()),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Discover)
