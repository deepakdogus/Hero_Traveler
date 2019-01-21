import React, { Component } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ExploreHeader from '../Components/ExploreHeader'
import Footer from '../Components/Footer'
import TabBar from '../Components/TabBar'
// import DiscoverGrid from '../Components/DiscoverGrid'
import CategoryActions from '../Shared/Redux/Entities/Categories'

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background}
`

const DiscoverText = styled(CenteredText)`
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

const tabBarTabs = ['CHANNELS', 'CATEGORIES']

class Discover extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
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
  }

  _navToCategory = (categoryId) => {
    this.props.reroute(`/category/${categoryId}`)
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
          <DiscoverText>DISCOVER</DiscoverText>
          <Footer />
        </ContentWrapper>
      </Wrapper>
    )
  }

  // render() {
  //   return (
  //     <Wrapper>
  //       <DiscoverHeader/>
  //       <ContentWrapper>
  //         <DiscoverText>EXPLORE</DiscoverText>
  //           <DiscoverGrid
  //             categories={this.props.categories}
  //             onClickCategory={this._navToCategory}
  //           />
  //         <Footer />
  //       </ContentWrapper>
  //     </Wrapper>
  //   )
  // }
}

function mapStateToProps(state, ownProps) {
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
  } = state.entities.categories;

  return {
    categories,
    categoriesFetchStatus,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    reroute: (path) => dispatch(push(path)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Discover)
