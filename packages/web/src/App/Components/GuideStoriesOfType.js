import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import FeedItemList from './FeedItemList'

const Wrapper = styled.div`
  margin: 20px 0;
`

const Title = styled.p`
  margin: 0;
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 600;
  font-size: 29px;
  line-height: 40px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.background};
`

const SeeAllText = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 600;
  font-size: 16px;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.redHighlights};
  cursor: pointer;
`

export default class GuideStoriesOfType extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    stories: PropTypes.arrayOf(PropTypes.object),
    isShowAll: PropTypes.bool,
    onClickShowAll: PropTypes.func,
  }

  _onClickShowAll = () => {
    this.props.onClickShowAll(null, this.props.type)
  }

  render() {
    const {
      stories,
      label,
      isShowAll
    } = this.props

    if (stories.length === 0) return null

    return (
      <Wrapper>
        <Title>{label}</Title>
        <FeedItemList
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