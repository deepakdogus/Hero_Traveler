import React, { Component } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FeedItemPreview from './FeedItemPreview'
import HorizontalDivider from './HorizontalDivider'

const MAX_PREVIEW_ITEMS = 6

const Wrapper = styled.div`
  margin: 45px 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 25px;
  grid-row-gap: 45px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    grid-template-columns: 1fr 1fr;
    margin: 0 20px;
  }
`

const StyledDivider = styled(HorizontalDivider)`
  display: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: block;
    margin: 0 20px;
  }
`

const Title = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 25px;
  line-height: 40px;
  letter-spacing: 0.6px;
  color: ${props => props.theme.Colors.background};
  padding-bottom: 20px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 20px;
    padding: 15px 20px;
  }
`

const SeeAllText = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 0.7px;
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 12px;
    margin: 20px;
    font-size: 15px;
    text-align: center;
    border: 1px solid ${props => props.theme.Colors.redHighlights};
    border-radius: 2px;
  }
`

export default class FeedItemGrid extends Component {
  static propTypes = {
    guideId: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    feedItems: PropTypes.arrayOf(PropTypes.object),
    isShowAll: PropTypes.bool,
    onClickShowAll: PropTypes.func,
    titlePadding: PropTypes.string,
    isHorizontalList: PropTypes.bool,
  }

  _onClickShowAll = () => {
    this.props.onClickShowAll(null, this.props.type)
  }

  isStory = feedItem => typeof feedItem.draft === 'boolean'

  renderFeedItems = () => {
    const {
      isShowAll,
      feedItems,
      guideId,
    } = this.props

    const feedItemList = feedItems.reduce((feedItemList, feedItem, index) => {
      if (index >= MAX_PREVIEW_ITEMS && !isShowAll) return feedItemList
      if (!feedItem) return feedItemList
      feedItemList.push((
        <FeedItemPreview
          key={feedItem.id}
          feedItem={feedItem}
          isStory={this.isStory(feedItem)}
          guideId={guideId}
          type='grid'
        />
      ))
      return feedItemList
    }, [])
    return feedItemList
  }

  render() {
    const {
      feedItems,
      label,
      isShowAll,
    } = this.props

    if (!feedItems || feedItems.length === 0) return null

    return (
      <Wrapper>
        <Title>{label}</Title>
        <Grid>
          {this.renderFeedItems()}
        </Grid>
        {feedItems.length > 6 && !isShowAll &&
          <SeeAllText onClick={this._onClickShowAll}>
            See All ({feedItems.length})
          </SeeAllText>
        }
        {!isShowAll && <StyledDivider color='light-grey'/>}
      </Wrapper>
    )
  }
}
