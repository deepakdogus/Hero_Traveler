import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'

import GenericList from '../../Components/Shared/GenericList'

import StoriesActions from '../../Shared/Redux/Entities/Stories'

import {
  Divider,
} from '../../Components/Shared/StyledListComponents'

const columns = [{
  title: 'Title',
  dataIndex: 'title',
  sorter: true,
},
{
  title: 'Date Published',
  dataIndex: 'createdAt',
  render: v => (<span>{moment(v).format('YYYY/MM/DD')}</span>),
  sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
},
{
  title: 'Author',
  dataIndex: 'author',
  sorter: true,
},
{
  title: 'User Type',
  dataIndex: 'user_type',
  sorter: true,
},
{
  title: 'Activity Type',
  dataIndex: 'type',
  sorter: true,
},
{
  title: 'Location',
  dataIndex: 'locationInfo.name',
  sorter: true,
},
{
  title: '# Likes',
  dataIndex: 'counts.likes',
  sorter: true,
},
{
  title: '# Comments',
  dataIndex: 'counts.comments',
  sorter: true,
},
{
  title: 'Status',
  dataIndex: 'status',
  sorter: true,
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/stories/${item.id}`}><Icon type='edit' /></Link>),
},
]

class StoriesInCategoryList extends React.Component {
  renderSubHeader = () => {
    const categoryName = get(this.props, 'location.query.categoryName', '')
    return (
      <Fragment>
        <b>Stories in {categoryName}</b>
        <Divider/>
      </Fragment>
    )
  }

  renderCustomBreadcrumb = () => {
    const categoryName = get(this.props, 'location.query.categoryName', '')
    return (
      <Fragment>
        <Link to="/categories">{`Categories > `}</Link>
        <span> Stories in {categoryName}</span>
      </Fragment>
    )
  }

  render() {
    const {
      list,
      total,
      isLoading,
      params,
      getStories,
    } = this.props

    const { categoryId } = get(this.props, 'match.params', {})

    return (
      <GenericList
        renderCustomBreadcrumb={this.renderCustomBreadcrumb}
        renderSubHeader={this.renderSubHeader}
        prefilter={{ categories: categoryId }}
        rowKey="id"
        entity="stories"
        list={list}
        columns={columns}
        isLoading={isLoading}
        params={params}
        total={total}
        getItems={getStories}
        showFlagged
      />
    )
  }
}

StoriesInCategoryList.propTypes = {
  list: PropTypes.array.isRequired,
  categoryId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getStories: PropTypes.func.isRequired,
}

function mapStateToProps(state, ownProps) {
  const newList = [...get(state, 'entities.stories.adminStories.byId', [])]
  const { categoryId } = get(ownProps, 'match.params', {})
  return {
    categoryId,
    list: newList,
    total: get(state, 'entities.stories.adminStories.total'),
    params: get(state, 'entities.stories.adminStories.params'),
    isLoading: get(state, 'entities.stories.adminStories.fetchStatus.fetching'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStories: (params) => dispatch(StoriesActions.adminGetStories(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoriesInCategoryList)
