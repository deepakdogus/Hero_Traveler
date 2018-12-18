import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'
import formatcoords from 'formatcoords'

import env from '../Config/Env'
import CategoryActions from '../Shared/Redux/Entities/Categories'

import FeedItemGrid from '../Components/FeedItemGrid'
import HorizontalDivider from '../Components/HorizontalDivider'
import Footer from '../Components/Footer'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX
const GUIDE_INDEX = env.SEARCH_GUIDE_INDEX
const MAX_STORY_RESULTS = 64
const MAX_GUIDE_RESULTS = 20

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
    const { location, lat, lng } = this.props

    // title label
    let label = ''
    if (location.search && location.search.indexOf('?t=') !== -1) {
      label = decodeURIComponent(
        location.search.split('?')[1].substring(2),
      ).toUpperCase()
    }
    else {
      label = `Near ${formatcoords(
        Number(lat),
        Number(lng),
      ).format('DD MM ss X', {latLonSeparator: ', ', decimalPlaces: 2})}`
    }
    this.setState({ label })

    // guides
    this.guideHelper = algoliaSearchHelper(algoliasearch, GUIDE_INDEX)
    this.setupSearchListeners(this.guideHelper, 'guides')
    this.search(this.guideHelper, MAX_STORY_RESULTS)

    // stories
    this.storyHelper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.storyHelper, 'stories')
    this.search(this.storyHelper, MAX_GUIDE_RESULTS)
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
    const { lat, lng, reroute } = this.props
    return () => {
      this.setState({seeAllType, seeAllLabel})
      reroute(`/results/${lat}/${lng}/${seeAllType}`)
    }
  }

  _shouldDisplaySection = (items, type) => {
    const { seeAllType } = this.state
    return !!items.length && (seeAllType === type || seeAllType === '')
  }

  renderFeedItemGrid = (type, label, items) => {
    if (!this._shouldDisplaySection(items, type)) return null
    return (
      <FeedItemGrid
        feedItems={items}
        isShowAll={this.state.seeAllType === type}
        label={label}
        showLabel={this.state.seeAllType !== type}
        onClickShowAll={this._onClickShowAll(type, label)}
      />
    )
  }

  render() {
    const { lastSearchResults, label, seeAllType, seeAllLabel } = this.state

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
          {this.renderFeedItemGrid('guide', 'GUIDES', lastSearchResults.guides)}
          {this.renderFeedItemGrid('stories', 'ALL STORIES', lastSearchResults.stories)}
          {this.renderFeedItemGrid('see', 'THINGS TO SEE', seeItems)}
          {this.renderFeedItemGrid('do', 'THINGS TO DO', doItems)}
          {this.renderFeedItemGrid('eat', 'THINGS TO EAT', eatItems)}
          {this.renderFeedItemGrid('see', 'PLACES TO STAY', stayItems)}
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
