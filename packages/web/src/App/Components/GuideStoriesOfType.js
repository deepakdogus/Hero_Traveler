import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FeedItemList from './FeedItemList'


const Wrapper = styled.div`
  margin: 20px 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0;
  }
`

const Title = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 29px;
  line-height: 40px;
  letter-spacing: .6px;
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
  letter-spacing: .2px;
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
`

export default class GuideStoriesOfType extends React.Component {
  static propTypes = {
    guideId: PropTypes.string,
    label: PropTypes.string,
    type: PropTypes.string,
    stories: PropTypes.arrayOf(PropTypes.object),
    isShowAll: PropTypes.bool,
    onClickShowAll: PropTypes.func,
    titlePadding: PropTypes.string
  }

  _onClickShowAll = () => {
    this.props.onClickShowAll(null, this.props.type)
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
        <FeedItemList
          guideId={guideId}
          feedItems={stories}
          isHorizontalList
          isShowAll={isShowAll}
        />
        {stories.length > 2 && !isShowAll &&
          <SeeAllText onClick={this._onClickShowAll}>
            See All ({stories.length})
          </SeeAllText>
        }
      </Wrapper>
    )
  }
}
