import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table, Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'
import capitalize from 'lodash/capitalize'

const Wrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 50px;
`

class UserItemsTable extends React.Component {
  state = {}

  render() {
    const {
      list,
      type,
    } = this.props

    const columns = [
      {
        title: 'Title',
        render: (item) => (<Link to={`/${type}/${item.id}`}>{item.title}</Link>),
        sorter: (a, b) => a.title.localeCompare(b.title),
      },
      {
        title: 'Date Published',
        dataIndex: 'createdAt',
        render: v => (<span>{moment(v).format('YYYY/MM/DD')}</span>),
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      },
      {
        title: 'id',
        dataIndex: 'id',
      },
      {
        title: 'Edit',
        render: (item) => (<Link to={`/${type}/${item.id}`}><Icon type='edit' /></Link>),
      },
    ]

    return (
      <Wrapper>
        <b>
          {capitalize(type)} Published ({list.length})
        </b>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={list}
          pagination={false}
        />
      </Wrapper>
    )
  }
}

UserItemsTable.propTypes = {
  list: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
}

export default UserItemsTable
