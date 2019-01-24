import React, { Component } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ExploreHeader from '../Components/ExploreHeader'
import Footer from '../Components/Footer'
import TabBar from '../Components/TabBar'
import DiscoverChannelsGrid from '../Components/DiscoverChannelsGrid'
import DiscoverCategoriesGrid from '../Components/DiscoverCategoriesGrid'
import DiscoverActions from '../Shared/Redux/DiscoverRedux'

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
    categories: PropTypes.array,
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
    this.props.reroute(`/discover/channel/${channelId}`)
  }

  _navToCategory = (categoryId) => {
    this.props.reroute(`/discover/category/${categoryId}`)
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
          && <DiscoverCategoriesGrid
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
    data: categories,
  } = state.discover.categories

  const { 
    data: channels,
  } = state.discover.channels

  return {
    channels,
    categories,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => dispatch(DiscoverActions.fetchCategories()),
    loadChannels: () => dispatch(DiscoverActions.fetchChannels()),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Discover)
