import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'

import env from '../Config/Env'
import CategoryActions from '../Shared/Redux/Entities/Categories'

import FeedItemGrid from '../Components/FeedItemGrid'
import HorizontalDivider from '../Components/HorizontalDivider'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const GUIDE_INDEX = env.SEARCH_GUIDE_INDEX

const Container = styled.div`
  margin: 80px 7% 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 20px 0 0;
  }
`

const ContentWrapper = styled.div`
  position: relative;
  margin: 0 auto;
  max-width: 960px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`

const ResultTitle = styled.div`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 700;
  font-size: 40px;
  color: ${props => props.theme.Colors.background};
  text-align: center;
  margin-bottom: 20px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 20px;
  }
`

const StyledDivider = styled(HorizontalDivider)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: block;
    margin: 0 20px;
  }
`

class SearchResults extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
    reroute: PropTypes.func,
    match: PropTypes.object,
  }

  state = { lastSearchResults: {stories: [], guides: []} }

  componentWillMount() {
    //guides
    this.guideHelper = algoliaSearchHelper(algoliasearch, GUIDE_INDEX)
    this.setupSearchListeners(this.guideHelper, 'guides')
    this.search(this.guideHelper, 20)

    //stories
    this.storyHelper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.storyHelper, 'stories')
    this.search(this.storyHelper, 64)
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.storyHelper)
    this.removeSearchListeners(this.guideHelper)
  }

  removeSearchListeners(helper) {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }

  setupSearchListeners(helper, type) {
    helper.on('result', res => {
      this.setState({
        search: false,
        lastSearchResults: {
          ...this.state.lastSearchResults,
          [type]: res.hits,
        },
      })
    })
    helper.on('search', () => {
      this.setState({ searching: true })
    })
  }

  search(helper, hits) {
    helper
      .setQuery('')
      .setQueryParameter(
        'aroundLatLng',
        `${this.props.match.params.lat}, ${this.props.match.params.lng}`,
      )
      .setQueryParameter('hitsPerPage', hits)
      .search()
  }

  render() {
    const { lastSearchResults } = this.state
    // const { resultTitle } = this.props

    return (
      <Container>
        <ContentWrapper>
          <ResultTitle>{`Result Title`}</ResultTitle>
          <StyledDivider color="light-grey" />
          {!!lastSearchResults.guides.length && (
            <FeedItemGrid
              feedItems={lastSearchResults.guides}
              isShowAll={false}
              label="GUIDES"
            />
          )}
          {!!lastSearchResults.stories.length && (
            <FeedItemGrid
              feedItems={lastSearchResults.stories}
              isShowAll={false}
              label="STORIES"
            />
          )}
        </ContentWrapper>
      </Container>
    )
  }
}

function mapStateToProps(state, ownProps) {
  let {
    fetchStatus: categoriesFetchStatus,
    entities: categories,
  } = state.entities.categories

  return {
    categories,
    categoriesFetchStatus,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    loadCategories: () => dispatch(CategoryActions.loadCategoriesRequest()),
    reroute: path => dispatch(push(path)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SearchResults)
