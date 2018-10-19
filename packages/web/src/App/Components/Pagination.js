import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { chunk } from 'lodash'

import ShowMore from './ShowMore'

class Pagination extends PureComponent {
  constructor(props) {
    super(props)

    const pages = chunk(props.records, props.totalPerPage)
    this.state = {
      pages,
      pageIndex: 0,
      lastPage: pages.length <= 1,
      [props.type]: pages[0],
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.type !== this.props.type) {
      const pages = chunk(nextProps.records, nextProps.totalPerPage)
      this.state = {
        pages,
        pageIndex: 0,
        lastPage: pages.length <= 1,
        [nextProps.type]: pages[0],
        [this.props.type]: null,
      }
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = () => {
    const { lastPage } = this.state

    if (lastPage) {
      return
    }

    const windowHeight =
      'innerHeight' in window ? window.innerHeight : document.documentElement.offsetHeight
    const { body, documentElement: html } = document
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    )
    const windowBottom = windowHeight + window.pageYOffset
    if (windowBottom >= docHeight) {
      setTimeout(() => {
        this.showMore()
      }, 250) // adds a slight delay to increase "fetching" effect for end-user
    }
  }

  showMore = (event) => {
    if (event) {
      event.preventDefault()
    }

    const { type } = this.props
    const { pageIndex, pages, [type]: page } = this.state
    const newPageIndex = pageIndex + 1

    this.setState({
      pageIndex: newPageIndex,
      [type]: [].concat(page, pages[newPageIndex]),
      lastPage: pages.length === newPageIndex + 1,
    }, this.paginate)
  }

  ShowMoreButton = () => {
    const { lastPage } = this.state

    if (lastPage) {
      return null
    }

    return <ShowMore />
  }

  paginate = () => {
    const { pageIndex, pages } = this.state
    const penultimatePage = (pages.length - 1) === (pageIndex + 1)
    if (penultimatePage) {
      this.props.onPaginate()
    }
  }

  render() {
    const { children, type } = this.props
    const { [type]: page } = this.state

    return children({
      [type]: page,
      ShowMore: this.ShowMoreButton,
    })
  }
}

Pagination.propTypes = {
  children: PropTypes.func.isRequired,
  records: PropTypes.arrayOf(PropTypes.object).isRequired,
  type: PropTypes.string.isRequired,
  onPaginate: PropTypes.func,
  totalPerPage: PropTypes.number,
}

Pagination.defaultProps = {
  onPaginate: () => {},
  totalPerPage: 10,
}

export default Pagination
