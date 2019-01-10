import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { Table, Input, Icon, Select, Button, message } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import get from 'lodash/get'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'

import AdminCategoriesActions from '../../Shared/Redux/Admin/Categories'
import Images from '../../Themes/Images'
import getImageUrl from '../../Shared/Lib/getImageUrl'

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

const SquareImg = styled.img`
  height: 90px;
  width: 90px;
`

const columns = [{
  title: 'Title',
  dataIndex: 'title',
  sorter: true,
},
{
  title: 'Date Created',
  dataIndex: 'createdAt',
  render: v => (<span>{moment(v).format('YYYY/MM/DD')}</span>),
  sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
},
{
  title: 'Created By',
  dataIndex: 'createdBy',
  sorter: true,
},
{
  title: '# Of Stories',
  render: (item) => {
    return (
      <Link
        to={{
          pathname: `/categories/${item._id}/stories`,
          query: { categoryName: item.title },
        }}
      >
        {get(item, 'counts.stories', 0)}
      </Link>)
  },
  sorter: true,
},
{
  title: '# Of Guides',
  render: (item) => (
    <Link
      to={{
        pathname: `/categories/${item._id}/guides`,
        query: { categoryName: item.title },
      }}
    >
      {item.numberOfGuides}
    </Link>
  ),
},
{
  title: '# Of Followers',
  dataIndex: 'counts.followers',
  sorter: true,
},
{
  title: 'Image',
  render: (item) => (<SquareImg src={getImageUrl(get(item, 'image'), 'categoryThumbnail') || Images.placeholder} />),
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/categories/${item.id}`}><Icon type='edit' /></Link>),
},
]

class CategoriesList extends React.Component {
  state = {
    selectedRowKeys: [],
    activeTab: 'all',
    selectedFilter: undefined,
    isActionLoading: false,
  }

  componentDidMount(){
    const { getCategories } = this.props 
    getCategories()
  }

  onChange = (pagination, filters, sorter) => {
    const { params, getCategories } = this.props
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
    getCategories({
      ...params,
      ...newParams,
    })
  }

  _handleSearch = (e) => this._onSearchChange(e.target.value)

  _onSearchChange = debounce((text) => {
    this.props.getCategories({
      search: text,
    })
  }, 300)

  _showAll = () => {
    const { getCategories, params } = this.props
    getCategories({
      ...params,
      query: undefined,
    })
    this.setState({
      activeTab: 'all',
    })
  }

  _showDeleted = () => {
    const { getCategories, params } = this.props
    getCategories({
      ...params,
      query: {
        isDeleted: true,
      },
    })
    this.setState({
      activeTab: 'deleted',
    })
  }

  _handleSelectChange = (value) => {
    this.setState({
      selectedFilter: value,
    })
  }

  _applyTypeFilter = () => {
    const { params, getCategories } = this.props
    const { selectedFilter } = this.state
    if (selectedFilter === 'all') {
      getCategories({
        ...params,
        query: {
          ...params.query,
          featured: undefined,
        },
      })
    }
    else {
      getCategories({
        ...params,
        query: {
          ...params.query,
          featured: true,
        },
      })
    }
  }

  _applyAction = () => {
    const { selectedRowKeys } = this.state
    const { restoreCategories, getCategories, params } = this.props
    this.setState({
      isActionLoading: true,
    })
    new Promise((resolve, reject) => {
      restoreCategories({
        ids: selectedRowKeys,
        resolve,
        reject,
      })
    }).then(() => {
      this.setState({
        isActionLoading: false,
      })
      message.success('Categories were restored')
      getCategories({
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
      message.error('There was error restoring categories')
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
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
          <Header>Categories</Header>
          <SearchContainer>
            <Input
              size='small'
              type='text'
              prefix={<Icon type='search' />}
              onChange={this._handleSearch}
              placeholder='Search Categories'
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
            <Tab active={this.state.activeTab === 'deleted'} onClick={this._showDeleted}>
              Deleted {this.state.activeTab === 'deleted' && <span>({total})</span>}
            </Tab>
          </LeftSpaceDiv>
        </MiddleRow>

        <FilterRow>
          <b>Filter by:</b>
          <LeftSpaceDiv>
            <Select
              placeholder="featured"
              value={this.state.selectedFilter}
              style={{
                width: 120,
              }}
              onChange={this._handleSelectChange}
            >
              <Option value="featured">featured</Option>
              <Option value="all">all</Option>
            </Select>

          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Button onClick={this._applyTypeFilter}>Filter</Button>
          </LeftSpaceDiv>
          <LeftSpaceDiv>
            <Link to='/newCategory'><Button type="primary">Create Category</Button></Link>
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

CategoriesList.propTypes = {
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getCategories: PropTypes.func.isRequired,
  restoreCategories: PropTypes.func.isRequired,
}

function mapStateToProps(state) {
  const newList = [...state.admin.categories.list]
  return {
    list: newList,
    total: state.admin.categories.total,
    params: state.admin.categories.params,
    isLoading: state.admin.categories.isLoading,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getCategories: (params) => dispatch(AdminCategoriesActions.adminGetCategories(params)),
    restoreCategories: (payload) => dispatch(AdminCategoriesActions.adminRestoreCategories(payload)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CategoriesList)
