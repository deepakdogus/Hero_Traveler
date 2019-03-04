import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

import AdminUserActions from '../../Shared/Redux/Admin/Users'

import GenericList from '../../Components/Shared/GenericList'

const columns = [{
  title: 'Username',
  dataIndex: 'username',
  sorter: true,
}, {
  title: 'Email',
  dataIndex: 'email',
  sorter: true,
}, {
  title: 'Full Name',
  dataIndex: 'profile.fullName',
  sorter: true,
},
{
  title: 'Date Joined',
  dataIndex: 'createdAt',
  render: v => (<span>{moment(v).format('YYYY/MM/DD')}</span>),
  sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
},
{
  title: 'User Type',
  dataIndex: 'role',
},
{
  title: '# Of Stories',
  dataIndex: 'numberOfStories',
},
{
  title: '# Of Followers',
  dataIndex: 'counts.followers',
  sorter: true,
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/users/${item.id}`}><Icon type='edit' /></Link>),
},
]

const filterOptions = [
  'user',
  'admin',
  'brand',
  'contributor',
  'founding member',
  'fellow',
]

class UsersList extends React.Component {
  render() {
    const {
      list,
      total,
      isLoading,
      params,
      getUsers,
      restoreUsers,
    } = this.props

    return (
      <GenericList
        rowKey="username"
        entity="users"
        list={list}
        columns={columns}
        isLoading={isLoading}
        params={params}
        total={total}
        getItems={getUsers}
        restoreItems={restoreUsers}
        filterField="role"
        filterPlaceholder="user role"
        filterOptions={filterOptions}
      />
    )
  }
}

UsersList.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getUsers: PropTypes.func.isRequired,
  restoreUsers: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const newList = [...state.admin.users.list]
  return {
    list: newList,
    total: state.admin.users.total,
    params: state.admin.users.params,
    isLoading: state.admin.users.isLoading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: (params) => dispatch(AdminUserActions.adminGetUsers(params)),
    restoreUsers: (payload) => dispatch(AdminUserActions.adminRestoreUsers(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UsersList)
