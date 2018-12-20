import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Table, Icon } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

const Wrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 50px;
`

const columns = [{
  title: 'Title',
  render: (item) => (<Link to={`/stories/${item.id}`}>{item.title}</Link>),
  sorter: true,
},
{
  title: 'Date Published',
  dataIndex: 'createdAt',
  render: v => (<span>{moment(v).format('YYYY/MM/DD')}</span>),
  sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
},
{
  title: 'Edit',
  render: (item) => (<Link to={`/stories/${item.id}`}><Icon type='edit' /></Link>),
},
]

class UserStoriesTable extends React.Component {
  state = {}

  render() {
    const {
      list,
    } = this.props

    return (
      <Wrapper>
        <b>
          Stories Published ({list.length})
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

UserStoriesTable.propTypes = {
  list: PropTypes.array.isRequired,
}

export default UserStoriesTable
