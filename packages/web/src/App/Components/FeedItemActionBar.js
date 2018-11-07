import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from './Icon'
import {Col} from './FlexboxGrid'

const StyledIcon = styled(Icon)`
  display: block;
  margin: auto;
  margin-bottom: 15px;
  height: 30px;
  width: 30px;
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-left: 5px;
    margin-right: 5px;
    margin-bottom: 0px;
  }
`

const HandMadeIcon = styled.div`display: block;
  margin: auto;
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
  width: 9px;
  background-color: ${props => props.theme.Colors.grey};
`

const LeftActionBarIcon = styled(StyledIcon)``
const BookmarkIcon = styled(StyledIcon)``
const FacebookIcon = styled(StyledIcon)``
const TwitterIcon = styled(StyledIcon)``
const DotsIcon = styled(StyledIcon)``

const ActionBarContainer = styled(Col)`
  z-index: 1;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    background-color: ${props => props.theme.Colors.snow}
  }
`

const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .2px;
  margin: 0;
  text-align: center;
`

const AbsoluteWrapper = styled.div`
  background-color: white;
  position: absolute;
  top: ${props => props.isStory ? '87px' : '170px' };
  right: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.desktopLarge}px) {
    left: 95%;
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    position: fixed;
    bottom: 0px;
    right: 0px;
    top: auto;
    left: auto;
    padding: 10px 0;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    border-top: 1px solid ${props => props.theme.Colors.navBarText};
  }
`

const ClickableWrapper = styled.div`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
`

export default class StoryActionBar extends React.Component {
  static propTypes = {
    feedItem: PropTypes.object,
    isStory: PropTypes.bool,
    isLiked: PropTypes.bool,
    onClickLike: PropTypes.func,
    isBookmarked: PropTypes.bool,
    onClickBookmark: PropTypes.func,
    onClickComments: PropTypes.func,
    onClickFlag: PropTypes.func,
    userId: PropTypes.string,
    reroute: PropTypes.func,
    onClickShare: PropTypes.func,
  }

  constructor(props){
    super(props)
    this.state = {
      showMore: false,
    }
  }

  toggleShowMore = () => {
    this.setState({
      showMore: !this.state.showMore,
    })
  }

  _onClickFlag = () => {
    this.props.onClickFlag(this.props.feedItem.id)
  }

  render () {
    const {
      feedItem,
      isStory,
      isLiked,
      isBookmarked,
      onClickBookmark,
      onClickLike,
      onClickComments,
      onClickShare,
    } = this.props

    return (
      <AbsoluteWrapper isStory={isStory}>
        <ActionBarContainer>
          {isStory &&
            <BookmarkIcon
              name={isBookmarked ? 'squareBookmarkActive' : 'squareBookmark'}
              onClick={onClickBookmark}
            />
          }
          <ClickableWrapper>
            <Count>{feedItem.counts.likes}</Count>
            <LeftActionBarIcon
              name={isLiked ? 'squareLikeActive' : 'squareLike'}
              onClick={onClickLike}
            />
          </ClickableWrapper>
          <ClickableWrapper>
            <Count>{feedItem.counts.comments}</Count>
            <LeftActionBarIcon
              name='squareComment'
              onClick={onClickComments}
            />
          </ClickableWrapper>
          <FacebookIcon
            name='squareFacebookOutline'
            onClick={onClickShare}
          />
          {/* hidden until after launch */}
          { false &&
            <TwitterIcon name='squareTwitterOutline'/>
          }
          {/* present at top level until after launch */}
          {isStory &&
              <ClickableWrapper>
                <StyledIcon
                  name='report'
                  onClick={this._onClickFlag}
                />
              </ClickableWrapper>
            }
          {/* hidden until after launch */}
          { false &&
            !this.state.showMore &&
            <DotsIcon
              name='dots'
              onClick={this.toggleShowMore}
            />
          }
        </ActionBarContainer>
        {/* hidden until after launch */}
        { false &&
          this.state.showMore &&
          <ActionBarContainer>
            <StyledIcon name='google'/>
            <StyledIcon name='tumblr'/>
            <StyledIcon name='pinterest'/>
            <StyledIcon name='email'/>
            {isStory &&
              <ClickableWrapper>
                <StyledIcon
                  name='report'
                  onClick={this._onClickFlag}
                />
              </ClickableWrapper>
            }
            <HandMadeIcon onClick={this.toggleShowMore}>
              <HandMadeIconMinus />
            </HandMadeIcon>
          </ActionBarContainer>
        }
      </AbsoluteWrapper>
    )
  }
}
