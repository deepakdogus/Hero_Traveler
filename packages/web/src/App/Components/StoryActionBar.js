import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {sizes} from '../Themes/Metrics'
import Icon from './Icon'
import {Col} from './FlexboxGrid'

const StyledIcon = styled(Icon)`
  display: block;
  margin: auto;
  margin-bottom: 15px;
  margin-left: 5px;
  margin-right: 5px;
  height: 20px;
  width: 20px;
`

const HandMadeIcon = styled.div`display: block;
  margin: auto;
  margin-bottom: 15px;
  margin-left: 5px;
  margin-right: 5px;
  height: 14px;
  width: 14px;
  border-radius: 14px;
  border-style: solid;
  border-color: ${props => props.theme.Colors.grey};
  border-width: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const HandMadeIconMinus = styled.div`
  display: block;
  height: 1px;
  width: 10px;
  background-color: ${props => props.theme.Colors.grey};
`

const LeftActionBarIcon = styled(StyledIcon)``
const BookmarkIcon = styled(StyledIcon)``
const FacebookIocn = styled(StyledIcon)``
const TwitterIcon = styled(StyledIcon)``
const DotsIcon = styled(StyledIcon)``

const ActionBarContainer = styled(Col)`
  @media (max-width: ${sizes.tablet}px) {
    display: flex;
    flex-direction: row;
  }
`

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
  position: fixed;
  top: 150px;
  left: 85%;
  @media (max-width: ${sizes.tablet}px) {
    display: flex;
    flex-direction: row;
    bottom: 50px;
    right: 10px;
    top: auto;
    left: auto;
  }
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
    onClickComments: PropTypes.func,
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
    const {story, isLiked, isBookmarked, onClickBookmark, onClickLike, onClickComments} = this.props

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
            <LeftActionBarIcon
              name='squareComment'
              onClick={onClickComments}
            />
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
            <HandMadeIcon onClick={this.toggleShowMore}>
              <HandMadeIconMinus />
            </HandMadeIcon>
          </ActionBarContainer>
        }
      </AbsoluteWrapper>
    )
  }
}
