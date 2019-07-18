import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import InfiniteScroll from 'react-infinite-scroller'

import FeedItemPreview from './FeedItemPreview'
import FeedItemMessage from './FeedItemMessage'
import HorizontalDivider from './HorizontalDivider'
import { itemsPerQuery } from '../Containers/ContainerWithFeedList'

const Wrapper = styled.div``

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

const itemsPerPage = 10

export default class FeedItemList extends React.Component {
  static propTypes = {
    guideId: PropTypes.string,
    feedItems: PropTypes.arrayOf(PropTypes.object),
    activeTab: PropTypes.string,
    feedItemCount: PropTypes.number,
    getTabInfo: PropTypes.func,
    fetching: PropTypes.bool,
  }

  state = {
    page: 1,
    hasMore: true,
  }

  componentDidUpdate(prevProps) {
    const { feedItems } = this.props
    const feedItemLength = feedItems && feedItems.length
    if (
      prevProps.feedItems.length === 0
      && (feedItemLength && feedItemLength < itemsPerPage)
    ) {
      this.setState({ hasMore: false })
    }
  }

  isStory(feedItem) {
    return typeof feedItem.draft === 'boolean'
  }

  renderFeedItems = () => {
    const { guideId, feedItems } = this.props
    const rows = feedItems.reduce((rows, feedItem, index) => {
      if (index > itemsPerPage * this.state.page) return rows

      if (!feedItem) return rows

      if (index !== 0) {
        rows.push(<StyledDivider
          key={`hr-${feedItem.id}`}
          color={'lighter-grey'}
                  />)
      }

      rows.push(
        <FeedItemPreview
          key={feedItem.id}
          guideId={guideId}
          feedItem={feedItem}
          isStory={this.isStory(feedItem)}
          type="list"
        />,
      )
      return rows
    }, [])

    return rows
  }

  loadFeedItems = page => {
    const { feedItemCount, activeTab, getTabInfo, feedItems } = this.props
    this.setState({ page })
    const isBeforeLastPage
      = (page * itemsPerPage) % itemsPerQuery >= itemsPerQuery - itemsPerPage
    if (isBeforeLastPage && activeTab === 'STORIES') {
      const pageToQuery = (page * itemsPerPage + itemsPerPage) / itemsPerQuery + 1
      getTabInfo(pageToQuery)
    }
    if (
      page * itemsPerPage >= feedItemCount
      || (!feedItemCount && page * itemsPerPage >= feedItems.length)
    ) {
      this.setState({ hasMore: false })
    }
  }

  render() {
    const { feedItems, activeTab, fetching } = this.props
    const noFeedItems = !feedItems || !feedItems.length

    if (fetching && activeTab === 'NEARBY' && noFeedItems) {
      return (
        <FeedItemMessage
          message={'Determining your location...'}
          smallMessage={'(this can take up to 1 minute the first time)'}
        />
      )
    }

    if (fetching) return <FeedItemMessage message={'Fetching your feed...'} />

    if (!fetching && activeTab === 'NEARBY' && noFeedItems)
      return (
        <FeedItemMessage
          message={`We couldn't determine your location or there are no stories near you.`}
        />
      )

    if (noFeedItems) {
      const noItemsMessage = `Looks like there are no ${
        activeTab ? activeTab.toLowerCase() : 'stories'
      } yet.`
      return <FeedItemMessage message={noItemsMessage} />
    }

    return (
      <Wrapper>
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
