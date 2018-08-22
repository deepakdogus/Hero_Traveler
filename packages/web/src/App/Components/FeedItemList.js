import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FeedItemPreview from './FeedItemPreview'
import HorizontalDivider from './HorizontalDivider'
import {Row} from './FlexboxGrid'

const StyledDivider = styled(HorizontalDivider)`
  max-width: 960px;
  margin: 20px auto;
`

const VerticalWrapper = styled.div``

const StyledRow = styled(Row)``

export default class FeedItemList extends React.Component {
  static propTypes = {
    feedItems: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
    isHorizontalList: PropTypes.bool,
    isShowAll: PropTypes.bool,
  }

  defaultProps = { isHorizontalList: false }

  render() {
    const {
      feedItems,
      type,
      isHorizontalList,
      isShowAll,
    } = this.props
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
          <StyledDivider key={`hr-${feedItem.id}`} color='lighter-grey'/>
        ))
      }
      rows.push((
        <FeedItemPreview
          key={feedItem.id}
          feedItem={feedItem}
          type={type}
          isStory={!!feedItem.locationInfo}
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
