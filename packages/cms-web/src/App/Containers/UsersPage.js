import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Table, Input, Icon } from 'antd'
import Immutable from 'seamless-immutable'
import moment from 'moment'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

import AdminActions from '../Shared/Redux/AdminRedux'

const Wrapper = styled.div``

const TopRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 50px;
`

const Header = styled.div`
  display: flex;
`

const SearchContainer = styled.div`
  display: flex;
`

const LeftSpaceDiv = styled.div`
  margin-left: 20px;
`

const MiddleRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`

const FilterRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`

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
  render: () => (<Icon type='edit' />),
},
]

class Feed extends React.Component {
  componentDidMount(){
    //get user feed on signUp and reset signUp redux
    this.props.getUsers()
  }

  onChange = (pagination, filters, sorter) => {
    const { params, getUsers } = this.props
    const newParams = {
      page: pagination.page,
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

  _onSearchChange = debounce((text) => {
    this.props.getUsers({
      search: text,
    })
  }, 300)

  render() {
    const {
      list,
      total,
      isLoading,
      params,
    } = this.props
      
    const paginationProps = {
      showTotal: (totalNum, range) => `${range[0]}–${range[1]} of ${totalNum} items`,
      total,
      current: params.page,
      pageSize: params.limit,
      position: 'both',
    }

    return (
      <Wrapper>
        <TopRow>
          <Header>Users</Header>
          <SearchContainer>
            <Input
              size='small'
              type='text'
              prefix={<Icon type='search' />}
              onChange={(e) => this._onSearchChange(e.target.value)}
              placeholder='Search Users'
            />
          </SearchContainer>
        </TopRow>
        
        <MiddleRow>
          <b>All ({total})</b>
          <LeftSpaceDiv> | 
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <a href='#'>Deleted</a>
          </LeftSpaceDiv>
        </MiddleRow>

        <FilterRow>
          <b>Filter by:</b>
          <LeftSpaceDiv>
            <Input size='small' type='text' />
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <button>Filter</button>
          </LeftSpaceDiv>
        </FilterRow>
        <Table
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

Feed.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getUsers: PropTypes.func.isRequired,
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
    getUsers: (params) => dispatch(AdminActions.adminGetUsers(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
