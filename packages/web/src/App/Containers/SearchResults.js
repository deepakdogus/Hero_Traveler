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
import Footer from '../Components/Footer'

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
    wentBack: PropTypes.bool,
    lat: PropTypes.string,
    lng: PropTypes.string,
    location: PropTypes.object,
  }

  state = {
    label: '',
    seeAllType: '',
    seeAllLabel: '',
    lastSearchResults: {
      stories: [],
      guides: [],
    },
  }

  componentWillMount() {
    const { location } = this.props

    //title
    if (location.search && location.search.indexOf('?t=') !== -1) {
      this.setState({ label: decodeURIComponent(location.search.split('?')[1].substring(2)).toUpperCase() })
    }

    //guides
    this.guideHelper = algoliaSearchHelper(algoliasearch, GUIDE_INDEX)
    this.setupSearchListeners(this.guideHelper, 'guides')
    this.search(this.guideHelper, 20)

    //stories
    this.storyHelper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.storyHelper, 'stories')
    this.search(this.storyHelper, 64)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.wentBack) this.setState({seeAllType: '', seeAllLabel: ''})
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.storyHelper)
    this.removeSearchListeners(this.guideHelper)
  }

  removeSearchListeners = helper => {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }

  setupSearchListeners = (helper, type) => {
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

  search = (helper, hits) => {
    helper
      .setQuery('')
      .setQueryParameter(
        'aroundLatLng',
        `${this.props.lat}, ${this.props.lng}`,
      )
      .setQueryParameter('hitsPerPage', hits)
      .search()
  }

  _onClickShowAll = (seeAllType, seeAllLabel) => {
    const { lng, reroute } = this.props
    return () => {
      this.setState({seeAllType, seeAllLabel})
      reroute(`${lng}/${seeAllType}`)
    }
  }

  render() {
    const { lastSearchResults, label, seeAllType, seeAllLabel } = this.state
    // const { resultTitle } = this.props

    const seeItems = lastSearchResults.stories.filter(feedItem => feedItem.type === 'see')
    const doItems = lastSearchResults.stories.filter(feedItem => feedItem.type === 'do')
    const eatItems = lastSearchResults.stories.filter(feedItem => feedItem.type === 'eat')
    const stayItems = lastSearchResults.stories.filter(feedItem => feedItem.type === 'stay')

    return (
      <Container>
        <ContentWrapper>
          <ResultTitle>
            {
              seeAllType
              ? `${label || 'Search Results'} - ${seeAllLabel}`
              : label
            }
          </ResultTitle>
          <StyledDivider color="light-grey" />
          {!!lastSearchResults.guides.length &&
            (seeAllType === 'guides' ||
             seeAllType === '') &&
            <FeedItemGrid
              feedItems={lastSearchResults.guides}
              isShowAll={seeAllType === 'guides'}
              label="GUIDES"
              showLabel={seeAllType !== 'guides'}
              onClickShowAll={this._onClickShowAll('guides', 'GUIDES')}
            />
          }
          {!!lastSearchResults.stories.length &&
            (seeAllType === 'stories' ||
            seeAllType === '') &&
            <FeedItemGrid
              feedItems={lastSearchResults.stories}
              isShowAll={seeAllType === 'stories'}
              label="ALL STORIES"
              showLabel={seeAllType !== 'stories'}
              onClickShowAll={this._onClickShowAll('stories', 'ALL STORIES')}
            />
          }
          {!!seeItems &&
            (seeAllType === 'see' ||
            seeAllType === '') &&
            <FeedItemGrid
              feedItems={seeItems}
              isShowAll={seeAllType === 'see'}
              label="THINGS TO SEE"
              showLabel={seeAllType !== 'see'}
              onClickShowAll={this._onClickShowAll('see', 'THINGS TO SEE')}
            />
          }
          {!!seeItems &&
            (seeAllType === 'do' ||
            seeAllType === '') &&
            <FeedItemGrid
              feedItems={doItems}
              isShowAll={seeAllType === 'do'}
              label="THINGS TO DO"
              showLabel={seeAllType !== 'do'}
              onClickShowAll={this._onClickShowAll('do', 'THINGS TO DO')}
            />
          }
          {!!seeItems &&
            (seeAllType === 'eat' ||
            seeAllType === '') &&
            <FeedItemGrid
              feedItems={eatItems}
              isShowAll={seeAllType === 'eat'}
              label="THINGS TO EAT"
              showLabel={seeAllType !== 'eat'}
              onClickShowAll={this._onClickShowAll('eat', 'THINGS TO EAT')}
            />
          }
          {!!seeItems &&
            (seeAllType === 'stay' ||
            seeAllType === '') &&
            <FeedItemGrid
              feedItems={stayItems}
              isShowAll={seeAllType === 'stay'}
              label="PLACES TO STAY"
              showLabel={seeAllType !== 'stay'}
              onClickShowAll={this._onClickShowAll('stay', 'PLACES TO STAY')}
            />
          }
        </ContentWrapper>
        <Footer />
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
    lat: ownProps.match.params.lat,
    lng: ownProps.match.params.lng,
    wentBack: ownProps.history.action === 'POP',
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
