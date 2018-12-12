import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Table from 'antd/lib/table'
import Immutable from 'seamless-immutable'
import moment from 'moment'

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
  sorter: (a, b) => a.username.length - b.username.length,
}, {
  title: 'Email',
  dataIndex: 'email',
  sorter: (a, b) => a.email.length - b.email.length,
}, {
  title: 'Full Name',
  dataIndex: 'profile.fullName',
  sorter: (a, b) => a.profile.fullName.length - b.profile.fullName.length,
},
{
  title: 'Date Joined',
  dataIndex: 'createdAt',
  render: (v) => (<span>{moment(v).format('YYYY/MM/DD')}</span>),
  sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
},
{
  title: 'User Type',
  dataIndex: 'role',
},
{
  title: '# Of Stories',
  dataIndex: 'counts.stories',
},
{
  title: '# Of Followers',
  dataIndex: 'counts.followers',
},
{
  title: 'Edit',
  render: () => (<span>Edit</span>)
},
]

class Feed extends React.Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    isLoading: PropTypes.bool.isRequired,
    getUsers: PropTypes.func.isRequired,
  }

  componentDidMount(){
    //get user feed on signUp and reset signUp redux
    this.props.getUsers()
  }

  onChange = (pagination, filters, sorter) => {
    console.log('params', pagination, filters, sorter)
  }

  render() {
    const {
      list,
      isLoading,
    } = this.props
    
    return (
      <Wrapper>
        <TopRow>
          <Header>Users</Header>
          <SearchContainer>
            <input type='text' />
            <LeftSpaceDiv>
              <button>Search Users</button>
            </LeftSpaceDiv>
          </SearchContainer>
        </TopRow>
        
        <MiddleRow>
          <b>All ({list.length})</b>
        </MiddleRow>

        <FilterRow>
          <b>Filter by:</b>
          <LeftSpaceDiv>
            <input type='text' />
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <button>Filter</button>
          </LeftSpaceDiv>
        </FilterRow>
        <Table loading={isLoading} columns={columns} dataSource={list} onChange={this.onChange} />
      </Wrapper>
    )
  }
}

function mapStateToProps(state) {
  return {
    list: Immutable.asMutable(state.admin.users.list || []),
    isLoading: state.admin.users.isLoading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: (params) => dispatch(AdminActions.adminGetUsers(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Feed)
