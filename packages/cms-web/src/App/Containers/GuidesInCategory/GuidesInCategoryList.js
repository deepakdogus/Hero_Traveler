import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'

import GenericList from '../../Components/Shared/GenericList'

import AdminGuidesActions from '../../Shared/Redux/Admin/Guides'

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
  title: 'Location',
  dataIndex: 'location',
  sorter: true,
},
{
  title: '# Likes',
  dataIndex: 'counts.guides',
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
  title: 'Verified',
  dataIndex: 'verified',
  sorter: true,
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/guides/${item.id}`}><Icon type='edit' /></Link>),
},
]

class GuidesInCategoryList extends React.Component {
  renderSubHeader = () => {
    const categoryName = get(this.props, 'location.query.categoryName', '')
    return (
      <Fragment>
        <b>Guides in {categoryName}</b>
        <Divider/>
      </Fragment>
    )
  }

  renderCustomBreadcrumb = () => {
    const categoryName = get(this.props, 'location.query.categoryName', '')
    return (
      <Fragment>
        <Link to="/categories">{`Categories > `}</Link>
        <span> Guides in {categoryName}</span>
      </Fragment>
    )
  }

  render() {
    const {
      list,
      total,
      isLoading,
      params,
      getGuides,
    } = this.props

    const { categoryId } = get(this.props, 'match.params', {})

    return (
      <GenericList
        renderCustomBreadcrumb={this.renderCustomBreadcrumb}
        renderSubHeader={this.renderSubHeader}
        prefilter={{ categories: categoryId }}
        rowKey="id"
        entity="guides"
        list={list}
        columns={columns}
        isLoading={isLoading}
        params={params}
        total={total}
        getItems={getGuides}
        showFlagged
      />
    )
  }
}

GuidesInCategoryList.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  categoryId: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired,
  getGuides: PropTypes.func.isRequired,
}

function mapStateToProps(state, ownProps) {
  const newList = [...state.admin.guides.list]
  const { categoryId } = get(ownProps, 'match.params', {})
  return {
    categoryId,
    list: newList,
    total: state.admin.guides.total,
    params: state.admin.guides.params,
    isLoading: state.admin.guides.isLoading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getGuides: (params) => dispatch(AdminGuidesActions.adminGetGuides(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GuidesInCategoryList)
