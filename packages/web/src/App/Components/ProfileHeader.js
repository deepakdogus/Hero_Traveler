import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Avatar from './Avatar'
import Header from './Header'
import {Row} from './FlexboxGrid'
import HeaderImageWrapper from './Headers/Shared/HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import RoundedButton from './RoundedButton'
import RightModal from './RightModal'
import CenterModal from './CenterModal'
import Icon from './Icon'
import {OverlayStyles} from './Overlay'
import getImageUrl from '../Shared/Lib/getImageUrl'

import FollowFollowing from './Modals/FollowFollowing'
import ProfileStats from './Modals/ProfileStats'
import Comments from './Modals/Comments'
import LikedBy from './Modals/LikedBy'
import SendTo from './Modals/SendTo'
import AddToBoard from './Modals/AddToBoard'
import CreateBoard from './Modals/CreateBoard'
import Settings from './Modals/Settings'
import Inbox from './Modals/Inbox'
import InboxThread from './Modals/InboxThread'
import NotificationsThread from './Modals/NotificationsThread'
import FAQTermsAndConditions from './Modals/FAQTermsAndConditions'
import ProfileBio from './Modals/ProfileBio'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  ${OverlayStyles}
`

const Username = styled.p`
  font-weight: 400;
  font-size: 30px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
`

const ItalicText = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .5px;
  font-style: italic;
  margin: 0;
`

const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 630px;
  top:0;
  text-align:center;
  z-index: 2;
`

const Count = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 23px;
  color ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
`

const CountLabel = styled.p`
  margin: 0;
  font-weight: 400;
  font-size: 13px;
  color ${props => props.theme.Colors.lightGrey};
  letter-spacing: 1.5px;
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  width: 72px;
  border-width: 1px 0 0 0;
`

const StyledAvatar = styled(Avatar)`
  margin: 0 auto;
`

const AvatarWrapper = styled.div`
  margin: 25px 0;
`

const Divider = styled.div`
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin: 0 20px;
`

const CountWrapper = styled(Row)`
  margin-top: 25px !important;
`

const CountItemWrapper = styled.div``

const ButtonWrapper = styled.div`
  margin-top: 25px;
`

const BottomLeft = styled.div`
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 1;
`

const ContributorText = styled.p`
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1px;
  margin: 0;
  padding-left: 10px;
  line-height: 25px;
`

export default class ProfileHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {modal: undefined }
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  openFollowedByModal = () => {
    this.setState({ modal: 'followedBy' })
  }


  render () {
    const {user, isContributor} = this.props
    const isUsersProfile = user.id === '59d64ca84722340010b12c98'
    const backgroundImage = getImageUrl(user.profile.cover)
    const ImageWrapper = backgroundImage ? OpaqueHeaderImageWrapper : HeaderImageWrapper
    const isFollowing = user.id === '59d508c56ed1d9001008780b'
    return (
      <ImageWrapper
        backgroundImage={backgroundImage}
        size='large'
        type='profile'
      >
        <Header isLoggedIn></Header>
        <Centered>
          <Username>{user.username}</Username>
          <StyledHorizontalDivider />
          <ItalicText>{user.profile.fullName}</ItalicText>
          <AvatarWrapper>
            <StyledAvatar
              avatarUrl={getImageUrl(user.profile.avatar)}
              type='profile'
              size='x-large'
            />
          </AvatarWrapper>
          <ItalicText>Read Bio</ItalicText>
          <CountWrapper center='xs'>
            <CountItemWrapper>
              <Count>{user.counts.followers}</Count>
              <CountLabel>Followers</CountLabel>
            </CountItemWrapper>
            <Divider/>
            <CountItemWrapper>
              <Count>{user.counts.following}</Count>
              <CountLabel>Following</CountLabel>
            </CountItemWrapper>
          </CountWrapper>
          <ButtonWrapper>
            { isUsersProfile &&
              <RoundedButton type='opaque' text='EDIT PROFILE'/>
            }
            {
              !isUsersProfile &&
              <div>
                <RoundedButton
                  margin='small'
                  onClick={this.openFollowedByModal}
                  type={isFollowing ? 'opaqueWhite' : 'opaque'}
                  text={isFollowing ? 'FOLLOWING' : 'FOLLOW'}
                />
                <RoundedButton
                  margin='small'
                  type='opaque'
                  text='MESSAGE'/>
              </div>
            }
          </ButtonWrapper>
        </Centered>
        <BottomLeft>
          {isContributor &&
            <Row>
              <Icon name='profileBadge'/>
              <ContributorText>CONTRIBUTOR</ContributorText>
            </Row>
          }
        </BottomLeft>

        <RightModal
          isOpen={this.state.modal === 'followedBy'}
          contentLabel='Followed By Modal'
          onRequestClose={this.closeModal}
        >
          <FollowFollowing closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'stats'}
          contentLabel='User Stats Modal'
          onRequestClose={this.closeModal}
        >
          <ProfileStats closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'comments'}
          contentLabel='Comments Modal'
          onRequestClose={this.closeModal}
        >
          <Comments closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'likedBy'}
          contentLabel='Liked By Modal'
          onRequestClose={this.closeModal}
        >
          <LikedBy closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'sendTo'}
          contentLabel='Send To Modal'
          onRequestClose={this.closeModal}
        >
          <SendTo closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'addToBoard'}
          contentLabel='Add To Board Modal'
          onRequestClose={this.closeModal}
        >
          <AddToBoard closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'createBoard'}
          contentLabel='Create Board'
          onRequestClose={this.closeModal}
        >
          <CreateBoard closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'settings'}
          contentLabel='Settings'
          onRequestClose={this.closeModal}
        >
          <Settings closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'notificationsThread'}
          contentLabel='Notifications Thread'
          onRequestClose={this.closeModal}
        >
          <NotificationsThread closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'inbox'}
          contentLabel='Inbox'
          onRequestClose={this.closeModal}
        >
          <Inbox closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'inboxThread'}
          contentLabel='Message Thread'
          onRequestClose={this.closeModal}
        >
          <InboxThread closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'profileBio'}
          contentLabel='Profile Bio'
          onRequestClose={this.closeModal}
        >
          <ProfileBio closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <CenterModal
          isOpen={this.state.modal === 'faqTermsAndConditions'}
          contentLabel='FAQ Terms & Conditions'
          onRequestClose={this.closeModal}
        >
          <FAQTermsAndConditions closeModal={this.closeModal}/>
        </CenterModal>

      </ImageWrapper>
    )
  }
}
