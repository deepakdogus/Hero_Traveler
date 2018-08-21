import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FeedItemPreview from './FeedItemPreview'
import HorizontalDivider from './HorizontalDivider'

const StyledDivider = styled(HorizontalDivider)`
  max-width: 960px;
  margin: 20px auto;
`

export default class FeedItemList extends React.Component {
  static propTypes = {
    feedItems: PropTypes.arrayOf(PropTypes.object),
    type: PropTypes.string,
  }

  render() {
    const {feedItems, type} = this.props
    const renderedFeedItems = feedItems.reduce((rows, feedItem, index) => {
      /*
        We only need the first 4 elements for suggestions
        We will improve this check to allow 'pagination' will carousel scroll
      */
      if (type === 'suggestions' && index >= 4) return null
      if (!feedItem) return rows
      if (index !== 0) {
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
        />
      ))
      return rows
    }, [])
    return (
      <div>
        {renderedFeedItems}
      </div>
    )
  }
}
