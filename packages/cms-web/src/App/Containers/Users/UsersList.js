import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Input, Icon, Select, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

import AdminUserActions from '../../Shared/Redux/Admin/Users'

import {
  Wrapper,
  TopRow,
  Header,
  SearchContainer,
  LeftSpaceDiv,
  LeftSpaceSpan,
  MiddleRow,
  FilterRow,
  ActionRow,
  Tab,
} from '../../Components/Shared/StyledListComponents'

const Option = Select.Option

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

class UsersList extends React.Component {
  state = {
    selectedRowKeys: [],
    activeTab: 'all',
    isActionLoading: false,
    selectedRole: undefined,
  }

  componentDidMount(){
    this._showActive()
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  onChange = (pagination, filters, sorter) => {
    const { params, getUsers } = this.props
    const newParams = {
      page: pagination.current,
      limit: pagination.pageSize,
    }
    if (!isEmpty(sorter)) {
      newParams.sort = {
        fieldName: sorter.field,
        order: sorter.order === 'ascend' ? 1 : -1,
      }
    }
    getUsers({
      ...params,
      ...newParams,
    })
  }

  _handleSearch = (e) => this._onSearchChange(e.target.value)

  _onSearchChange = debounce((text) => {
    this.props.getUsers({
      search: text,
    })
  }, 300)

  _showAll = () => {
    const { getUsers, params } = this.props
    getUsers({
      ...params,
      query: undefined,
    })
    this.setState({
      activeTab: 'all',
    })
  }

  _showDeleted = () => {
    const { getUsers, params } = this.props
    getUsers({
      ...params,
      query: {
        isDeleted: true,
      },
    })
    this.setState({
      activeTab: 'deleted',
    })
  }

  _showActive = () => {
    const { getUsers, params } = this.props
    getUsers({
      ...params,
      query: {
        isDeleted: {$in: [null, false]},
      },
    })
    this.setState({
      activeTab: 'active',
    })
  }

  _handleSelectChange = (value) => {
    this.setState({
      selectedRole: value,
    })
  }

  _applyTypeFilter = () => {
    const { params, getUsers } = this.props
    getUsers({
      ...params,
      query: {
        ...params.query,
        role: this.state.selectedRole,
      },
    })
  }

  _applyAction = () => {
    const { selectedRowKeys } = this.state
    const { restoreUsers, getUsers, params } = this.props
    this.setState({
      isActionLoading: true,
    })
    new Promise((resolve, reject) => {
      restoreUsers({
        usernames: selectedRowKeys,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        isActionLoading: false,
      })
      message.success('Users were restored')
      getUsers({
        ...params,
        query: {
          isDeleted: true,
        },
      })
      this.setState({
        selectedRowKeys: [],
      })
    }).catch((e) => {
      this.setState({
        isActionLoading: false,
      })
      message.error('There was error restoring users')
    })
  }

  render() {
    const {
      list,
      total,
      isLoading,
      params,
    } = this.props
    
    const {
      selectedRowKeys,
      isActionLoading,
    } = this.state

    const paginationProps = {
      showTotal: (totalNum, range) => `${range[0]}–${range[1]} of ${totalNum} items`,
      total,
      current: params.page,
      pageSize: params.limit,
      position: 'both',
    }

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const hasSelected = selectedRowKeys.length > 0

    return (
      <Wrapper>
        <TopRow>
          <Header>Users</Header>
          <SearchContainer>
            <Input
              size='small'
              type='text'
              prefix={<Icon type='search' />}
              onChange={this._handleSearch}
              placeholder='Search Users'
            />
          </SearchContainer>
        </TopRow>
        
        <MiddleRow>
          
          <Tab active={this.state.activeTab === 'active'} onClick={this._showActive}>
            Active {this.state.activeTab === 'active' && <span>({total})</span>}
          </Tab>
          <LeftSpaceDiv> | 
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Tab active={this.state.activeTab === 'deleted'} onClick={this._showDeleted}>
              Deleted {this.state.activeTab === 'deleted' && <span>({total})</span>}
            </Tab>
          </LeftSpaceDiv>
          <LeftSpaceDiv> | 
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Tab active={this.state.activeTab === 'all'} onClick={this._showAll}>
              All {this.state.activeTab === 'all' && <span>({total})</span>}
            </Tab>
          </LeftSpaceDiv>
        </MiddleRow>

        <FilterRow>
          <b>Filter by:</b>
          <LeftSpaceDiv>
            <Select
              placeholder="user type"
              value={this.state.selectedRole}
              style={{
                width: 120,
              }}
              onChange={this._handleSelectChange}
            >
              <Option value="user">User</Option>
              <Option value="admin">Admin</Option>
              <Option value="brand">Brand</Option>
              <Option value="contributor">Contributor</Option>
              <Option value="founding member">Founding Member</Option>
              <Option value="fellow">Fellow</Option>
            </Select>

          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Button onClick={this._applyTypeFilter}>Filter</Button>
          </LeftSpaceDiv>
        </FilterRow>
        {this.state.activeTab === 'deleted' &&
          <ActionRow>
            <Button
              type="primary"
              onClick={this._applyAction}
              disabled={!hasSelected}
              loading={isActionLoading}
            >
              Restore
            </Button>
            <LeftSpaceSpan>
              {hasSelected ? `${selectedRowKeys.length} selected items` : ''}
            </LeftSpaceSpan>
          </ActionRow>
        }
        <Table
          rowSelection={this.state.activeTab === 'deleted' ? rowSelection : null}
          rowKey="username"
          loading={isLoading}
          columns={columns}
          dataSource={list}
          onChange={this.onChange}
          pagination={paginationProps}
        />
      </Wrapper>
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
