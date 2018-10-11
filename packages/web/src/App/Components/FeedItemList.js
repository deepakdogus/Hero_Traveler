import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FeedItemPreview from './FeedItemPreview'
import FeedItemMessage from './FeedItemMessage'
import HorizontalDivider from './HorizontalDivider'
import { Row } from './FlexboxGrid'

const StyledDivider = styled(HorizontalDivider)`
  max-width: 960px;
  margin: 20px auto;
  border-width: 1px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    border-color: transparent;
    background-color: transparent;
    margin-top: 0;
    margin-bottom: 15px;
  }
`

const VerticalWrapper = styled.div`
`

const StyledRow = styled(Row)`
`

export default class FeedItemList extends React.Component {
  static propTypes = {
    guideId: PropTypes.string,
    feedItems: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
    isHorizontalList: PropTypes.bool,
    isShowAll: PropTypes.bool,
    activeTab: PropTypes.string,
  }

  defaultProps = { isHorizontalList: false }

  isStory(feedItem) {
    return typeof feedItem.draft === 'boolean'
  }

  render() {
    const {
      guideId,
      feedItems,
      type,
      isHorizontalList,
      isShowAll,
      activeTab,
    } = this.props

    if (!feedItems || !feedItems.length) {
      const noItemsMessage = `Looks like there are no ${
        activeTab ? activeTab.toLowerCase() : 'stories '
      } yet.`
      return <FeedItemMessage message={noItemsMessage} />
    }

    const renderedFeedItems = feedItems.reduce((rows, feedItem, index) => {
      /*
        We only need the first 4 elements for suggestions
        We will improve this check to allow 'pagination' will carousel scroll
      */
      if (type === 'suggestions' && index >= 4) return rows
      if (isHorizontalList && index >= 2 && !isShowAll) return rows

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

    const Wrapper = isHorizontalList ? StyledRow : VerticalWrapper
    const wrapperProps = isHorizontalList ? { between: 'xs'} : {}

    return (
      <Wrapper {...wrapperProps}>
        {renderedFeedItems}
      </Wrapper>
    )
  }
}
