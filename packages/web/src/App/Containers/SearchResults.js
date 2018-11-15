import React, { Component } from 'react'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'
import _ from 'lodash'

import env from '../Config/Env'
import CategoryActions from '../Shared/Redux/Entities/Categories'
import GuideStoriesOfType from '../Components/GuideStoriesOfType'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const STORY_INDEX = env.SEARCH_STORY_INDEX

const Wrapper = styled.div``

class SearchResults extends Component {
  static propTypes = {
    categories: PropTypes.object,
    fetchStatus: PropTypes.bool,
    loadCategories: PropTypes.func,
    reroute: PropTypes.func,
  }

  state = { 'lastSearchResults': [] }

  componentWillMount() {
    this.helper = algoliaSearchHelper(algoliasearch, STORY_INDEX)
    this.setupSearchListeners(this.helper)
    _.debounce(() => {
      this.helper
        .setQuery('')
        .setQueryParameter('aroundLatLng' , '13.443182, -15.31013899999994')
        .search()
    }, 300)()
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.helper)
  }

  removeSearchListeners(helper) {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }

  setupSearchListeners(helper) {
    helper.on('result', res => {
      this.setState({
        search: false,
        lastSearchResults: res.hits,
      })
    })
    helper.on('search', () => {
      this.setState({searching: true})
    })
  }

  render() {
    const {lastSearchResults} = this.state

    return (
      <Wrapper>
        {lastSearchResults.length &&
          <GuideStoriesOfType
            stories={lastSearchResults}
            isShowAll={false}
            label='ALL STORIES'
          />
        }
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

export default connect(mapStateToProps, mapDispatchToProps)(SearchResults)
