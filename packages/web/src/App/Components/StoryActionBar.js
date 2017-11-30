import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Icon from './Icon'
import {Col} from './FlexboxGrid'

const StyledIcon = styled(Icon)`
  display: block;
  margin: auto;
  margin-bottom: 15px;
  height: 20px;
  width: 20px;
`

const LeftActionBarIcon = styled(StyledIcon)``
const BookmarkIcon = styled(StyledIcon)``
const FacebookIocn = styled(StyledIcon)``
const TwitterIcon = styled(StyledIcon)``
const DotsIcon = styled(StyledIcon)``

const ActionBarContainer = styled(Col)``

const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  margin: 0;
  text-align: center;
`

const AbsoluteWrapper = styled.div`
  position: absolute;
  top: 150px;
  left: 85%;
`

const ClickableWrapper = styled.div`

`

export default class StoryActionBar extends React.Component {
  static propTypes = {
    story: PropTypes.object,
    isLiked: PropTypes.bool,
    onClickLike: PropTypes.func,
    isBookmarked: PropTypes.bool,
    onClickBookmark: PropTypes.func,
  }

  constructor(props){
    super(props)
    this.state = {
      showMore: false
    }
  }

  toggleShowMore = () => {
    this.setState({
      showMore: !this.state.showMore
    })
  }

  render () {
    const {story, isLiked, isBookmarked, onClickBookmark, onClickLike} = this.props

    return (
      <AbsoluteWrapper>
        <ActionBarContainer>
          <BookmarkIcon
            name={isBookmarked ? 'squareBookmarkActive' : 'squareBookmark'}
            onClick={onClickBookmark}
          />
          <ClickableWrapper>
            <Count>{story.counts.likes}</Count>
            <LeftActionBarIcon
              name={isLiked ? 'squareLikeActive' : 'squareLike'}
              onClick={onClickLike}
            />
          </ClickableWrapper>
          <ClickableWrapper>
            <Count>{story.counts.comments}</Count>
            <LeftActionBarIcon name='squareComment'/>
          </ClickableWrapper>
          <FacebookIocn name='squareFacebookOutline'/>
          <TwitterIcon name='squareTwitterOutline'/>
          {!this.state.showMore &&
            <DotsIcon
              name='dots'
              onClick={this.toggleShowMore}
            />}
        </ActionBarContainer>
        { this.state.showMore &&
          <ActionBarContainer>
            <StyledIcon name='google'/>
            <StyledIcon name='tumblr'/>
            <StyledIcon name='pinterest'/>
            <StyledIcon name='email'/>
            <StyledIcon name='report'/>
            <StyledIcon name='profile' onClick={this.toggleShowMore}/>
          </ActionBarContainer>
        }
      </AbsoluteWrapper>
    )
  }
}
