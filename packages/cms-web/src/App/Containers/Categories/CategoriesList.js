import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon, Button } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'
import algoliasearchModule from 'algoliasearch'
import algoliaSearchHelper from 'algoliasearch-helper'

import CategoriesActions from '../../Shared/Redux/Entities/Categories'
import Images from '../../Themes/Images'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import env from '../../Config/Env'

import GenericList from '../../Components/Shared/GenericList'

import {
  SquareImg,
} from '../../Components/Shared/StyledListComponents'

const algoliasearch = algoliasearchModule(env.SEARCH_APP_NAME, env.SEARCH_API_KEY)
const CATEGORY_INDEX = env.SEARCH_CATEGORIES_INDEX

const columns = [{
  title: 'Title',
  dataIndex: 'title',
  sorter: true,
},
{
  title: 'Date Created',
  dataIndex: 'createdAt',
  render: v => (<span>{moment(v).format('YYYY/MM/DD')}</span>),
  sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
},
{
  title: '# Of Stories',
  render: (item) => {
    return (
      <Link
        to={{
          pathname: `/categories/${item._id}/stories`,
          query: { categoryName: item.title },
        }}
      >
        {get(item, 'counts.stories', 0)}
      </Link>)
  },
  sorter: true,
},
{
  title: '# Of Guides',
  render: (item) => (
    <Link
      to={{
        pathname: `/categories/${item._id}/guides`,
        query: { categoryName: item.title },
      }}
    >
      {item.numberOfGuides}
    </Link>
  ),
},
{
  title: '# Of Followers',
  dataIndex: 'counts.followers',
  sorter: true,
},
{
  title: 'Image',
  render: (item) => (
    <SquareImg
      src={getImageUrl(get(item, 'image'), 'categoryThumbnail') || Images.placeholder}
    />
  ),
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/categories/${item.id}`}><Icon type='edit' /></Link>),
},
]

const filterOptions = [
  'featured',
  'all',
]

class CategoriesList extends React.Component {
  handleApplyTypeFilter = (value) => {
    const { getCategories, params } = this.props
    getCategories({
      ...params,
      query: {
        ...params.query,
        featured: value === 'all' ? undefined : true,
      },
    })
  }

  componentDidMount = () => {
    this.categoryHelper = algoliaSearchHelper(algoliasearch, CATEGORY_INDEX, {
      disjunctiveFacets: ['title'],
    })
    this.setupSearchListeners(this.categoryHelper, 'categories')
  }

  componentWillUnmount() {
    this.removeSearchListeners(this.categoryHelper)

    // avoids not showing new results/showing deleted stories
    this.categoryHelper.clearCache()
  }

  removeSearchListeners = helper => {
    helper.removeAllListeners('result')
    helper.removeAllListeners('search')
  }

  setupSearchListeners = (helper, type) => {
    helper.on('result', res => {
      console.log('res', res)
      this.setState({
        searching: false,
        searchResults: res.hits,
      })
    })
    helper.on('search', () => {
      this.setState({ searching: true })
    })
  }

  search = (helper, value) => {
    // helper.addDisjunctiveFacetRefinement(
    //   'title',
    //   `${value}`,
    // )
    helper
      .setQuery()
      .setQueryParameter('hitsPerPage', 10)
      .search()
  }

  runSearch = (value) => {
    this.search(this.categoryHelper, value)
  }

  render() {
    const {
      list,
      total,
      isLoading,
      params,
      getCategories,
      restoreCategories,
      isRestoring,
    } = this.props

    const additionalControls = [
      (
        <Link to='/newCategory' key="link">
          <Button type="primary">Create Category</Button>
        </Link>
      ),
    ]

    return (
      <GenericList
        rowKey="id"
        entity="categories"
        list={list}
        columns={columns}
        isLoading={isLoading}
        params={params}
        total={total}
        getItems={getCategories}
        runSearch={this.runSearch}
        restoreItems={restoreCategories}
        isRestoring={isRestoring}
        filterField="featured"
        filterPlaceholder="featured"
        filterOptions={filterOptions}
        onApplyTypeFilter={this.handleApplyTypeFilter}
        additionalControls={additionalControls}
      />
    )
  }
}

CategoriesList.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isRestoring: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getCategories: PropTypes.func.isRequired,
  restoreCategories: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const newList = [...get(state, 'entities.categories.adminCategories.byId', [])]
  return {
    list: newList,
    total: get(state, 'entities.categories.adminCategories.total'),
    params: get(state, 'entities.categories.adminCategories.params'),
    isLoading:
      get(state, 'entities.categories.adminCategories.fetchStatus.fetching'),
    isRestoring:
      get(state, 'entities.categories.adminCategories.isRestoring'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getCategories: (params) =>
      dispatch(CategoriesActions.adminGetCategories(params)),
    restoreCategories: (payload) =>
      dispatch(CategoriesActions.adminRestoreCategories(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesList)
