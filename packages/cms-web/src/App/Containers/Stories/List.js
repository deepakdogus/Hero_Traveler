import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Table, Input, Icon, Select, Button } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

import AdminStoriesActions from '../../Shared/Redux/Admin/Stories'

const Option = Select.Option

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

const Tab = styled.div`
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'regular'};
  color: ${props => props.active ? 'black' : '#008dff'};
`

const ActionRow = styled.div`
  margin-bottom: 16px;
`

const LeftSpaceSpan = styled.div`
  margin-left: 20px;
`

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
  state = {
    activeTab: 'all',
    selectedRole: undefined,
    selectedRowKeys: [],
    isActionLoading: false,
  }

  componentDidMount(){
    const { getStories } = this.props 
    getStories()
  }

  onChange = (pagination, filters, sorter) => {
    const { params, getStories } = this.props
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
    getStories({
      ...params,
      ...newParams,
    })
  }

  _handleSearch = (e) => this._onSearchChange(e.target.value)

  _onSearchChange = debounce((text) => {
    this.props.getStories({
      search: text,
    })
  }, 300)

  _showAll = () => {
    const { getStories, params } = this.props
    getStories({
      ...params,
      query: undefined,
    })
    this.setState({
      activeTab: 'all',
    })
  }

  _showDeleted = () => {
    const { getStories, params } = this.props
    getStories({
      ...params,
      query: {
        isDeleted: true,
      },
    })
    this.setState({
      activeTab: 'deleted',
    })
  }

  _showFlagged = () => {
    const { getStories, params } = this.props
    getStories({
      ...params,
      query: {
        flagged: true,
      },
    })
    this.setState({
      activeTab: 'flagged',
    })
  }

  _handleSelectChange = (value) => {
    this.setState({
      selectedRole: value,
    })
  }

  _applyTypeFilter = () => {
    const { params, getStories } = this.props
    getStories({
      ...params,
      query: {
        ...params.query,
        role: this.state.selectedRole,
      },
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
          <Header>Stories</Header>
          <SearchContainer>
            <Input
              size='small'
              type='text'
              prefix={<Icon type='search' />}
              onChange={this._handleSearch}
              placeholder='Search Stories'
            />
          </SearchContainer>
        </TopRow>
        
        <MiddleRow>
          <Tab active={this.state.activeTab === 'all'} onClick={this._showAll}>
            All {this.state.activeTab === 'all' && <span>({total})</span>}
          </Tab>
          <LeftSpaceDiv> | 
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Tab active={this.state.activeTab === 'flagged'} onClick={this._showFlagged}>
              Flagged {this.state.activeTab === 'flagged' && <span>({total})</span>}
            </Tab>
          </LeftSpaceDiv>
          <LeftSpaceDiv> | 
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Tab active={this.state.activeTab === 'deleted'} onClick={this._showDeleted}>
              Deleted {this.state.activeTab === 'deleted' && <span>({total})</span>}
            </Tab>
          </LeftSpaceDiv>
        </MiddleRow>

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
          rowKey="id"
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

StoriesList.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getStories: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const newList = [...state.admin.stories.list]
  return {
    list: newList,
    total: state.admin.stories.total,
    params: state.admin.stories.params,
    isLoading: state.admin.stories.isLoading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStories: (params) => dispatch(AdminStoriesActions.adminGetStories(params)),
    restoreStories: (payload) => dispatch(AdminStoriesActions.adminRestoreStories(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoriesList)
