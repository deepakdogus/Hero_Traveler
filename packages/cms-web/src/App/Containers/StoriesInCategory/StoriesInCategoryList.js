import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Table, Input, Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

import AdminStoriesActions from '../../Shared/Redux/Admin/Stories'

import {
  Wrapper,
  TopRow,
  Header,
  SearchContainer,
  LeftSpaceDiv,
  Divider,
  MiddleRow,
  Tab,
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
  state = {
    activeTab: 'all',
    selectedRole: undefined,
  }

  componentDidMount(){
    const { categoryId } = get(this.props, 'match.params', {})
    //get user StoriesInCategoryList on signUp and reset signUp redux
    this.props.getStories({
      query: {
        categories: categoryId,
        isDeleted: {$in: [null, false]},
      },
    })
    this.setState({
      activeTab: 'active',
    })
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
    const { getStories, categoryId, params } = this.props
    getStories({
      ...params,
      query: {
        categories: categoryId,
      },
    })
    this.setState({
      activeTab: 'all',
    })
  }

  _showActive = () => {
    const { getStories, categoryId, params } = this.props
    getStories({
      ...params,
      query: {
        categories: categoryId,
        isDeleted: {$in: [null, false]},
      },
    })
    this.setState({
      activeTab: 'active',
    })
  }

  _showDeleted = () => {
    const { getStories, categoryId, params } = this.props
    getStories({
      ...params,
      query: {
        categories: categoryId,
        isDeleted: true,
      },
    })
    this.setState({
      activeTab: 'deleted',
    })
  }

  _showFlagged = () => {
    const { getStories, categoryId, params } = this.props
    getStories({
      ...params,
      query: {
        categories: categoryId,
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

    const categoryName = get(this.props, 'location.query.categoryName', '')
      
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
          <Header>
            <Link to="/categories">{`Categories > `}</Link>
            <span> Stories in {categoryName}</span>
          </Header>
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

        <b>Stories in {categoryName}</b>
        <Divider/>
        
        <MiddleRow>
          <Tab active={this.state.activeTab === 'active'} onClick={this._showActive}>
            Active {this.state.activeTab === 'active' && <span>({total})</span>}
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
          <LeftSpaceDiv> | 
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Tab active={this.state.activeTab === 'all'} onClick={this._showAll}>
              All {this.state.activeTab === 'all' && <span>({total})</span>}
            </Tab>
          </LeftSpaceDiv>
        </MiddleRow>

        <Table
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

StoriesInCategoryList.propTypes = {
  list: PropTypes.array.isRequired,
  categoryId: PropTypes.string.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getStories: PropTypes.func.isRequired,
}

function mapStateToProps(state, ownProps) {
  const newList = [...state.admin.stories.list]
  const { categoryId } = get(ownProps, 'match.params', {})
  return {
    categoryId,
    list: newList,
    total: state.admin.stories.total,
    params: state.admin.stories.params,
    isLoading: state.admin.stories.isLoading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getStories: (params) => dispatch(AdminStoriesActions.adminGetStories(params)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StoriesInCategoryList)
