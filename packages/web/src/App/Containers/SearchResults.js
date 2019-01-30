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
const MAX_RADIUS = 804672 // = 250 miles in meters
const METER_PRECISION = 1000 // 0-1000m, 1001-2000m, etc., distances ranked "equally near"

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
    country: PropTypes.string,
    seeAllType: PropTypes.string,
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

  typeLabels = {
    guides: 'Guides',
    stories: 'All Stories',
    see: 'Things to See',
    do: 'Things to Do',
    eat: 'Things to Eat',
    stay: 'Places to Stay',
  }

  componentWillMount() {
    const { location, lat, lng, seeAllType } = this.props

    // title label
    let label = ''
    if (location.search && location.search.indexOf('?t=') !== -1) {
      label = decodeURIComponent(
        location.search.split('?')[1].substring(2),
      )
    }
    else {
      label = `Search Results - ${formatcoords(
        Number(lat),
        Number(lng),
      ).format('DD X', {latLonSeparator: ', ', decimalPlaces: 2})}`
    }
    this.setState({
      label,
      seeAllType: seeAllType || '',
      seeAllLabel: seeAllType ? this.typeLabels[seeAllType] : '',
    })

    // guides
    this.guideHelper = algoliaSearchHelper(algoliasearch, GUIDE_INDEX, {
      disjunctiveFacets: ['locationInfo.country'],
    })
    this.setupSearchListeners(this.guideHelper, 'guides')
    this.search(this.guideHelper, MAX_STORY_RESULTS)

    // stories
    this.storyHelper = algoliaSearchHelper(algoliasearch, STORY_INDEX, {
      disjunctiveFacets: ['locationInfo.country'],
    })
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
        searching: false,
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
    const { country, lat, lng } = this.props
    helper.addDisjunctiveFacetRefinement(
      'locationInfo.country',
      `${country}`,
    )
    helper
      .setQuery()
      .setQueryParameter(
        'aroundLatLng',
        `${lat}, ${lng}`,
      )
      .setQueryParameter('aroundRadius', MAX_RADIUS)
      .setQueryParameter('aroundPrecision', METER_PRECISION)
      .setQueryParameter('hitsPerPage', hits)
      .search()
  }

  _onClickShowAll = (seeAllType, seeAllLabel) => {
    const { lat, lng, reroute } = this.props
    return () => {
      this.setState({seeAllType, seeAllLabel})
      reroute(`/results/${lat}/${lng}/${seeAllType}?t=${
        encodeURIComponent(this.state.label)
      }`)
    }
  }

  _shouldDisplaySection = (items, type) => {
    const { seeAllType } = this.state
    return (
      !!items
      && !!items.length
      && (seeAllType === type
      || seeAllType === '')
    )
  }

  render() {
    const { lastSearchResults, label, seeAllType, seeAllLabel } = this.state
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
          {Object.keys(this.typeLabels).map(type => {
            const feedItems = (type === 'guides' || type === 'stories')
              ? lastSearchResults[type]
              : lastSearchResults.stories.filter(feedItem => feedItem.type === type)
            if (!this._shouldDisplaySection(feedItems, type)) return null

            return (
              <FeedItemGrid
                key={`${type}-search-grid`}
                feedItems={feedItems}
                isShowAll={this.state.seeAllType === type}
                label={this.typeLabels[type].toUpperCase()}
                showLabel={this.state.seeAllType !== type}
                onClickShowAll={this._onClickShowAll(type, this.typeLabels[type])}
              />
            )
          })}
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
    country: ownProps.match.params.country,
    seeAllType: ownProps.match.params.seeAllType,
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
