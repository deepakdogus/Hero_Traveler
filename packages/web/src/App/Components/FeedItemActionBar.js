import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Icon from './Icon'
import { Col } from './FlexboxGrid'
import { shareLinkOnTwitter, shareLinkOnEmail } from '../Lib/sharingWeb'

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

const LeftActionBarIcon = styled(StyledIcon)``

const BookmarkIcon = styled(StyledIcon)``

const FacebookIcon = styled(StyledIcon)`
  padding: 5px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`
const TwitterIcon = styled(StyledIcon)``

const ActionBarContainer = styled(Col)`
  z-index: 1;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    background-color: ${props => props.theme.Colors.snow};
  }
`

const Count = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  font-size: 14px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 0.2px;
  margin: 0;
  text-align: center;
`

/*
 * At <960px width, the image begins to shrink, invaldating the default
 * (800px / 2) + 80px right offset from center. The desktop breakpoint with
 * percent offset from the right allows for a smooth transition.
 *
 * FIXME: smoother transition for guide near the large desktop breakpoint
 */
const AbsoluteWrapper = styled.div`
  background-color: white;
  position: fixed;
  top: ${props => props.isStory ? '214px' : '297px'};
  right: calc(50vw - ${props => props.wrapperMaxWidth / 2 || 0}px - 80px);
  @media (max-width: ${props => props.theme.Metrics.sizes.desktopLarge}px) {
    ${props => !props.isStory && 'right: 1.5%'};
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.desktop}px) {
    right: 1.5%;
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
    overflow-x: auto;
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
    wrapperMaxWidth: PropTypes.number,
  }

  constructor(props) {
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

  _onClickEmail = () => {
    const { feedItem, isStory } = this.props
    shareLinkOnEmail(feedItem, isStory ? 'story' : 'guide')
  }

  _onClickTwitter = async () => {
    const { feedItem, isStory } = this.props
    shareLinkOnTwitter(feedItem, isStory ? 'story' : 'guide')
  }

  render() {
    const {
      feedItem,
      isStory,
      isLiked,
      isBookmarked,
      onClickBookmark,
      onClickLike,
      onClickComments,
      onClickShare,
      wrapperMaxWidth,
    } = this.props

    return (
      <AbsoluteWrapper
        isStory={isStory}
        wrapperMaxWidth={wrapperMaxWidth}
      >
        <ActionBarContainer>
          {isStory && (
            <BookmarkIcon
              name={isBookmarked ? 'squareBookmarkActive' : 'squareBookmark'}
              onClick={onClickBookmark}
            />
          )}
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
              name="squareComment"
              onClick={onClickComments}
            />
          </ClickableWrapper>
          <FacebookIcon
            name="squareFacebookOutline"
            onClick={onClickShare}
          />
          <ClickableWrapper>
            <TwitterIcon
              name="squareTwitterOutline"
              onClick={this._onClickTwitter}
            />
          </ClickableWrapper>
          <ClickableWrapper>
            <StyledIcon
              name="email"
              onClick={this._onClickEmail}
            />
          </ClickableWrapper>
          {/* present at top level until after launch */}
          {isStory && (
            <ClickableWrapper>
              <StyledIcon
                name="flag"
                onClick={this._onClickFlag}
              />
            </ClickableWrapper>
          )}
        </ActionBarContainer>
      </AbsoluteWrapper>
    )
  }
}
