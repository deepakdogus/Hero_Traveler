import React, { Component } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import ExploreHeader from '../Components/ExploreHeader'
import Footer from '../Components/Footer'
import ExploreGrid from '../Components/ExploreGrid'
import CategoryActions from '../Shared/Redux/Entities/Categories'

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background}
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

class Explore extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
    reroute: PropTypes.func,
  }

  componentDidMount() {
    this.props.loadCategories()
  }

  _navToCategory = (categoryId) => {
    this.props.reroute(`/category/${categoryId}`)
  }

  render() {
    return (
      <Wrapper>
        <ExploreHeader/>
        <ContentWrapper>
          <ExploreText>EXPLORE</ExploreText>
            <ExploreGrid
              categories={this.props.categories}
              onClickCategory={this._navToCategory}
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

export default connect(mapStateToProps, mapDispatchToProps)(Explore)
