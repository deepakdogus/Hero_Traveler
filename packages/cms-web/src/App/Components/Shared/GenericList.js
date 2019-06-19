import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Table, Input, Icon, Select, Button, message } from 'antd'
import debounce from 'lodash/debounce'
import isEmpty from 'lodash/isEmpty'
import capitalize from 'lodash/capitalize'

import {
  Wrapper,
  TopRow,
  Header,
  SearchContainer,
  LeftSpaceWrapper,
  LeftSpaceSpan,
  MiddleRow,
  FilterRow,
  ActionRow,
  Tab,
} from '../../Components/Shared/StyledListComponents'

const Option = Select.Option

class GenericList extends React.Component {
  state = {
    selectedRowKeys: [],
    activeTab: 'all',
    selectedFilter: undefined,
  }

  componentDidMount(){
    this._showActive()
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  onChange = (pagination, filters, sorter) => {
    const { params, getItems } = this.props
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
    getItems({
      ...params,
      ...newParams,
    })
  }

  _handleSearch = (e) => this._onSearchChange(e.target.value)

  _onSearchChange = debounce((text) => {
    this.props.getItems({
      search: text,
    })
  }, 300)

  _showAll = () => {
    const { getItems, params } = this.props
    getItems({
      ...params,
      query: undefined,
    })
    this.setState({
      activeTab: 'all',
    })
  }

  _showFlagged = () => {
    const { getItems, params } = this.props
    getItems({
      ...params,
      query: {
        flagged: true,
      },
    })
    this.setState({
      activeTab: 'flagged',
    })
  }

  _showDeleted = () => {
    const { getItems, params } = this.props
    getItems({
      ...params,
      query: {
        deleted: true,
      },
    })
    this.setState({
      activeTab: 'deleted',
    })
  }

  _showActive = () => {
    const { getItems, params, prefilter } = this.props
    getItems({
      ...params,
      query: {
        ...prefilter,
        deleted: {$in: [null, false]},
      },
    })
    this.setState({
      activeTab: 'active',
    })
  }

  _handleSelectChange = (value) => {
    this.setState({
      selectedFilter: value,
    })
  }

  _applyTypeFilter = () => {
    const { params, filterField, getItems, onApplyTypeFilter, prefilter } = this.props
    if (onApplyTypeFilter) return onApplyTypeFilter(this.state.selectedFilter)
    getItems({
      ...params,
      query: {
        ...params.query,
        ...prefilter,
        [filterField]: this.state.selectedFilter,
      },
    })
  }

  _applyAction = () => {
    const { selectedRowKeys } = this.state
    const { restoreItems, rowKey, params, prefilter } = this.props
    const key = `${rowKey}s`
    const getParams = {
      ...params,
      query: {
        ...prefilter,
        deleted: true,
      },
    }
    restoreItems({
      [key]: selectedRowKeys,
      message,
      getParams,
    })
    this.setState({
      selectedRowKeys: [],
    })
  }

  render() {
    const {
      rowKey,
      entity,
      list,
      total,
      isLoading,
      params,
      columns,
      filterPlaceholder,
      filterField,
      filterOptions,
      additionalControls,
      showFlagged,
      restoreItems,
      renderCustomBreadcrumb,
      renderSubHeader,
      isRestoring,
    } = this.props
    
    const {
      selectedRowKeys,
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

    const capEntity = capitalize(entity)

    return (
      <Wrapper>
        <TopRow>
          <Header>{renderCustomBreadcrumb ? renderCustomBreadcrumb() : capEntity}</Header>
          <SearchContainer>
            <Input
              size='small'
              type='text'
              prefix={<Icon type='search' />}
              onChange={this._handleSearch}
              placeholder={`Search ${capEntity}`}
            />
          </SearchContainer>
        </TopRow>

        {renderSubHeader && renderSubHeader()}
        
        <MiddleRow>
          <Tab active={this.state.activeTab === 'active'} onClick={this._showActive}>
            Active {this.state.activeTab === 'active' && <span>({total})</span>}
          </Tab>
          <LeftSpaceWrapper> | 
          </LeftSpaceWrapper>
          {showFlagged
            && <Fragment>
              <LeftSpaceWrapper>
                <Tab
                  active={this.state.activeTab === 'flagged'}
                  onClick={this._showFlagged}
                >
                  Flagged {this.state.activeTab === 'flagged' && <span>({total})</span>}
                </Tab>
              </LeftSpaceWrapper>
              <LeftSpaceWrapper> | 
              </LeftSpaceWrapper>
            </Fragment>
          }
          <LeftSpaceWrapper>
            <Tab active={this.state.activeTab === 'deleted'} onClick={this._showDeleted}>
              Deleted {this.state.activeTab === 'deleted' && <span>({total})</span>}
            </Tab>
          </LeftSpaceWrapper>
          <LeftSpaceWrapper> | 
          </LeftSpaceWrapper>
          <LeftSpaceWrapper>
            <Tab active={this.state.activeTab === 'all'} onClick={this._showAll}>
              All {this.state.activeTab === 'all' && <span>({total})</span>}
            </Tab>
          </LeftSpaceWrapper>
        </MiddleRow>

        {filterField && (
          <FilterRow>
            <b>Filter by:</b>
            <LeftSpaceWrapper>
              <Select
                placeholder={filterPlaceholder}
                value={this.state.selectedFilter}
                style={{
                  width: 120,
                }}
                onChange={this._handleSelectChange}
              >
                {filterOptions.map(o =>
                  (<Option key={o} value={o}>{capitalize(o)}</Option>),
                )}
              </Select>

            </LeftSpaceWrapper>
            <LeftSpaceWrapper>
              <Button onClick={this._applyTypeFilter}>Filter</Button>
            </LeftSpaceWrapper>
            {additionalControls.map((c, i) =>
              (<LeftSpaceWrapper key={`${i}`}>{c}</LeftSpaceWrapper>))
            }
          </FilterRow>
        )}
        {this.state.activeTab === 'deleted' && (
          <ActionRow>
            <Button
              type="primary"
              onClick={this._applyAction}
              disabled={!isRestoring && !hasSelected}
              loading={isRestoring}
            >
              Restore
            </Button>
            <LeftSpaceSpan>
              {hasSelected ? `${selectedRowKeys.length} selected items` : ''}
            </LeftSpaceSpan>
          </ActionRow>
        )}
        <Table
          rowSelection={
            restoreItems && this.state.activeTab === 'deleted'
              ? rowSelection
              : null
          }
          rowKey={rowKey}
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

GenericList.propTypes = {
  rowKey: PropTypes.string,
  entity: PropTypes.string.isRequired,
  columns: PropTypes.array.isRequired,
  list: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,
  params: PropTypes.object.isRequired,
  total: PropTypes.number.isRequired,
  getItems: PropTypes.func.isRequired,
  restoreItems: PropTypes.func.isRequired,
  filterField: PropTypes.string,
  filterPlaceholder: PropTypes.string,
  filterOptions: PropTypes.array,
  onApplyTypeFilter: PropTypes.func,
  additionalControls: PropTypes.array,
  showFlagged: PropTypes.bool,
  renderCustomBreadcrumb: PropTypes.func,
  renderSubHeader: PropTypes.func,
  prefilter: PropTypes.object,
  isRestoring: PropTypes.bool.isRequired,
}

GenericList.defaultProps = {
  rowKey: 'id',
  additionalControls: [],
  showFlagged: false,
  prefilter: {},
}

export default GenericList
