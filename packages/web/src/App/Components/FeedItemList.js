import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'

import FeedItemPreview from './FeedItemPreview'
import FeedItemMessage from './FeedItemMessage'
import HorizontalDivider from './HorizontalDivider'
import { Row } from './FlexboxGrid'
import { itemsPerQuery } from '../Containers/ContainerWithFeedList'

const StyledDivider = styled(HorizontalDivider)`
  max-width: 960px;
  margin: 20px auto;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    border-color: transparent;
    background-color: transparent;
    margin-top: 0;
    margin-bottom: 15px;
  }
`

const VerticalWrapper = styled.div``

const StyledRow = styled(Row)``

const itemsPerPage = 10

export default class FeedItemList extends React.Component {
  static propTypes = {
    guideId: PropTypes.string,
    feedItems: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
    isHorizontalList: PropTypes.bool,
    isShowAll: PropTypes.bool,
    activeTab: PropTypes.string,
    feedItemCount: PropTypes.number,
    getTabInfo: PropTypes.func,
  }

  state = {
    page: 1,
    hasMore: true,
  }

  defaultProps = { isHorizontalList: false }

  isStory(feedItem) {
    return typeof feedItem.draft === 'boolean'
  }

  renderFeedItems = () => {
    const {
      guideId,
      type,
      isHorizontalList,
      isShowAll,
      feedItems,
    } = this.props

    return feedItems.reduce((rows, feedItem, index) => {
      /*
        We only need the first 4 elements for suggestions
        We will improve this check to allow 'pagination' will carousel scroll
      */
      if (type === 'suggestions' && index >= 4) return rows
      if (isHorizontalList && index >= 2 && !isShowAll) return rows
      if (index > itemsPerPage * this.state.page) return rows

      if (!feedItem) return rows
      if (index !== 0 && !isHorizontalList) {
        rows.push((
          <StyledDivider
            key={`hr-${feedItem.id}`}
            color={'lighter-grey'}
          />
        ))
      }
      rows.push((
        <FeedItemPreview
          key={feedItem.id}
          guideId={guideId}
          feedItem={feedItem}
          type={type}
          isStory={this.isStory(feedItem)}
          isVertical={isHorizontalList}
        />
      ))
      return rows
    }, [])
  }

  loadFeedItems = (page) => {
    this.setState({page})
    const isBeforeLastPage = (
      (page * itemsPerPage) % itemsPerQuery)
      >= (itemsPerQuery - itemsPerPage
    )
    if (isBeforeLastPage && this.props.activeTab === 'STORIES') {
      const pageToQuery = ((page * itemsPerPage + itemsPerPage) / itemsPerQuery) + 1
      this.props.getTabInfo(pageToQuery)
    }
    if (page * itemsPerPage >= this.props.feedItemCount) {
      this.setState({hasMore: false})
    }
  }

  render() {
    const {
      feedItems,
      isHorizontalList,
      activeTab,
    } = this.props

    if (!feedItems || !feedItems.length) {
      const noItemsMessage = `Looks like there are no ${
        activeTab ? activeTab.toLowerCase() : 'stories'
      } yet.`
      return <FeedItemMessage message={noItemsMessage} />
    }

    const Wrapper = isHorizontalList ? StyledRow : VerticalWrapper
    const wrapperProps = isHorizontalList ? { between: 'xs'} : {}

    return (
      <Wrapper {...wrapperProps}>
        <InfiniteScroll
          pageStart={1}
          loadMore={this.loadFeedItems}
          hasMore={this.state.hasMore}
        >
          {this.renderFeedItems()}
        </InfiniteScroll>
      </Wrapper>
    )
  }
}
