import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'

import GenericList from '../../Components/Shared/GenericList'

import GuidesActions from '../../Shared/Redux/Entities/Guides'

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
  title: 'Location',
  dataIndex: 'locations.0.name',
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
    return (<div>draft</div>)
  },
  sorter: true,
},
{
  title: 'Verified',
  dataIndex: 'isVerified',
  sorter: true,
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/guides/${item.id}`}><Icon type='edit' /></Link>),
},
]

class GuidesList extends React.Component {
  render() {
    const {
      list,
      total,
      isLoading,
      params,
      getGuides,
      restoreGuides,
    } = this.props

    return (
      <GenericList
        rowKey="id"
        entity="guides"
        list={list}
        columns={columns}
        isLoading={isLoading}
        params={params}
        total={total}
        getItems={getGuides}
        restoreItems={restoreGuides}
        showFlagged
      />
    )
  }
}

GuidesList.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getGuides: PropTypes.func.isRequired,
  restoreGuides: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const newList = [...get(state, 'entities.guides.adminGuides.byId', [])]
  console.log('state', state)
  return {
    list: newList,
    total: get(state, 'entities.guides.adminGuides.total'),
    params: get(state, 'entities.guides.adminGuides.params'),
    isLoading: get(state, 'entities.guides.adminGuides.fetchStatus.fetching'),
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGuides: (params) => dispatch(GuidesActions.adminGetGuides(params)),
    restoreGuides: (payload) => dispatch(GuidesActions.adminRestoreGuides(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuidesList)
