import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'

import GenericList from '../../Components/Shared/GenericList'

import StoriesActions from '../../Shared/Redux/Entities/Stories'

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
  dataIndex: 'author.username',
  sorter: true,
},
{
  title: 'User Type',
  dataIndex: 'author.role',
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
  render: (item) => {
    if (item.flagged) return (<div>flagged</div>)
    if (item.featured) return (<div>featured</div>)
    if (item.pinned) return (<div>pinned</div>)
    return (<div>story</div>)
  },
  sorter: true,
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/stories/${item.id}`}><Icon type='edit' /></Link>),
},
]

class StoriesList extends React.Component {
  render() {
    const {
      list,
      total,
      isLoading,
      params,
      getStories,
      restoreStories,
      isRestoring,
    } = this.props

    return (
      <GenericList
        rowKey="id"
        entity="stories"
        list={list}
        columns={columns}
        isLoading={isLoading}
        params={params}
        total={total}
        getItems={getStories}
        restoreItems={restoreStories}
        isRestoring={isRestoring}
        showFlagged
      />
    )
  }
}

StoriesList.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isRestoring: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getStories: PropTypes.func.isRequired,
  restoreStories: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const newList = [...get(state, 'entities.stories.adminStories.byId', [])]
  return {
    list: newList,
    total: get(state, 'entities.stories.adminStories.total'),
    params: get(state, 'entities.stories.adminStories.params'),
    isLoading: get(state, 'entities.stories.adminStories.fetchStatus.fetching'),
    isRestoring: get(state, 'entities.stories.adminStories.isRestoring'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStories: (params) => dispatch(StoriesActions.adminGetStories(params)),
    restoreStories: (payload) =>
      dispatch(StoriesActions.adminRestoreStories(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoriesList)
