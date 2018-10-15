import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import pluralize from 'pluralize'
import styled from 'styled-components'
import { chunk } from 'lodash'

import RoundedButton from './RoundedButton'
import { Row } from './FlexboxGrid'

const ButtonRow = styled(Row)`
  align-items: center;
  justify-content: center;
  padding-top: 25px;
  & button {
    cursor: pointer;
  }
`

class Pagination extends PureComponent {
  constructor(props) {
    super(props)

    this.type = pluralize(props.type)
    const pages = chunk(props.records, props.totalPerPage)
    this.state = {
      pages,
      pageIndex: 0,
      lastPage: pages.length <= 1,
      [this.type]: pages[0],
    }
  }

  loadMore = (event) => {
    event.preventDefault()

    const { pageIndex, pages, [this.type]: page } = this.state
    const newPageIndex = pageIndex + 1

    this.setState({
      pageIndex: newPageIndex,
      [this.type]: [].concat(page, pages[newPageIndex]),
      lastPage: pages.length === newPageIndex + 1,
    })
  }

  LoadMoreButton = () => {
    const { lastPage } = this.state

    if (lastPage) {
      return null
    }

    return (
      <ButtonRow>
        <RoundedButton
          margin="none"
          onClick={this.loadMore}
          text="Read more"
        />
      </ButtonRow>
    )
  }

  render() {
    const { [this.type]: page } = this.state

    return this.props.children({
      [this.type]: page,
      LoadMoreButton: this.LoadMoreButton,
    })
  }
}

Pagination.propTypes = {
  children: PropTypes.func.isRequired,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.string.isRequired,
  totalPerPage: PropTypes.number,
}

Pagination.defaultProps = {
  totalPerPage: 10,
}

export default Pagination
