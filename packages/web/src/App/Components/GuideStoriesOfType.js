import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FeedItemList from './FeedItemList'
import HorizontalDivider from './HorizontalDivider'

const Wrapper = styled.div`
  margin: 45px 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
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
  font-size: 29px;
  line-height: 40px;
  letter-spacing: 0.6px;
  color: ${props => props.theme.Colors.background};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 20px;
    padding: 15px 20px;
  }
`

const SeeAllText = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.2px;
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

export default class GuideStoriesOfType extends React.Component {
  static propTypes = {
    guideId: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    stories: PropTypes.arrayOf(PropTypes.object),
    isShowAll: PropTypes.bool,
    onClickShowAll: PropTypes.func,
    titlePadding: PropTypes.string,
  }

  _onClickShowAll = () => {
    this.props.onClickShowAll(null, this.props.type)
  }

  /*
  * for guides, stories must display as a row of 2-3 items, which currently
  * requires us to use multiple single-row FeedItemList components; this logic
  * splits a flat array of stories into a 2D array of 2-item story arrays to pass
  * to FeedItemList components
  *
  * TODO: Refactor this logic into a full-fledged FeedItemGrid component
  */
  _renderFeedItemLists = () => {
    const chunks = 2
    const { stories } = this.props
    return Array(Math.ceil(stories.length / chunks))
      .fill()
      .map((_, index) => index * chunks)
      .map(begin => stories.slice(begin, begin + chunks))
  }

  render() {
    const {
      stories,
      label,
      isShowAll,
      guideId,
    } = this.props

    if (stories.length === 0) return null

    return (
      <Wrapper>
        <Title>{label}</Title>
        {isShowAll
          ? this._renderFeedItemLists().map((feedItemList, idx) => {
            return (
              <FeedItemList
                key={`${guideId}-${idx}`}
                guideId={guideId}
                feedItems={feedItemList}
                isHorizontalList
                isShowAll={isShowAll}
                type='guideRow'
              />
            )
          })
          : <FeedItemList
            guideId={guideId}
            feedItems={stories}
            isHorizontalList
            isShowAll={isShowAll}
            type='guideRow'
          />
        }
        {stories.length > 2 && !isShowAll &&
          <SeeAllText onClick={this._onClickShowAll}>
            See All ({stories.length})
          </SeeAllText>
        }
        {!isShowAll && <StyledDivider color='light-grey'/>}
      </Wrapper>
    )
  }
}
