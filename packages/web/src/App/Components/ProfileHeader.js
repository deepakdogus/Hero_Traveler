import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Avatar from './Avatar'
import Header from './Header'
import {Row} from './FlexboxGrid'
import HeaderImageWrapper from './HeaderImageWrapper'
import VerticalCenter from './VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import RoundedButton from './RoundedButton'
import RightModal from './RightModal'
import CenterModal from './CenterModal'
import Icon from './Icon'
import getImageUrl from '../Shared/Lib/getImageUrl'
import FollowFollowing from './Modals/FollowFollowing'
import ProfileStats from './Modals/ProfileStats'
import UserComments from './Modals/UserComments'
import LikedBy from './Modals/LikedBy'
import SendTo from './Modals/SendTo'
import AddToBoard from './Modals/AddToBoard'
import CreateBoard from './Modals/CreateBoard'
import Settings from './Modals/Settings'
import SettingsPassword from './Modals/SettingsPassword'
import SettingsServices from './Modals/SettingsServices'
import SettingsNotifications from './Modals/SettingsNotifications'
import Inbox from './Modals/Inbox'
import MessageThread from './Modals/MessageThread'
import Notifications from './Modals/Notifications'
import FAQ from './Modals/FAQ'
import TermsAndConditions from './Modals/TermsAndConditions'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    background: rgba(0, 0, 0, .3);
  }
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

export default class StoryHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {modal: 'userComments' }
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  openFollowedByModal = () => {
    this.setState({ modal: 'followedBy' })
  }

  toggleModal = (e) => {
    let target = e.target.innerHTML.toLowerCase().split(' ')[0];
    this.setState({ modal: target })
  }

  render () {
    const {user, isContributor} = this.props
    const isUsersProfile = user.id === '596cd072fc3f8110a6f18342'
    const backgroundImage = getImageUrl(user.profile.cover)
    const ImageWrapper = backgroundImage ? OpaqueHeaderImageWrapper : HeaderImageWrapper
    const isFollowing = user.id === '590b9b0a4990800011537924'
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
          <FollowFollowing closeModal={this.closeModal}profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'stats'}
          contentLabel='User Stats Modal'
          onRequestClose={this.closeModal}
        >
          <ProfileStats closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'userComments'}
          contentLabel='User Comments Modal'
          onRequestClose={this.closeModal}
        >
          <UserComments closeModal={this.closeModal} profile={user}/>
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
          isOpen={this.state.modal === 'account'}
          contentLabel='Edit Settings'
          onRequestClose={this.closeModal}
        >
          <Settings closeModal={this.closeModal} toggleModal={this.toggleModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'password'}
          contentLabel='Edit Password'
          onRequestClose={this.closeModal}
        >
          <SettingsPassword  closeModal={this.closeModal} toggleModal={this.toggleModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'services'}
          contentLabel='Edit Services'
          onRequestClose={this.closeModal}
        >
          <SettingsServices  closeModal={this.closeModal} toggleModal={this.toggleModal} profile={user}/>
        </RightModal>                       
        <RightModal
          isOpen={this.state.modal === 'notifications'}
          contentLabel='Edit Notifications'
          onRequestClose={this.closeModal}
        >
          <SettingsNotifications closeModal={this.closeModal} toggleModal={this.toggleModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'inbox'}
          contentLabel='Inbox'
          onRequestClose={this.closeModal}
        >
          <Inbox closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'messageThread'}
          contentLabel='Message Thread'
          onRequestClose={this.closeModal}
        >
          <MessageThread closeModal={this.closeModal} profile={user}/>
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'notificationsThread'}
          contentLabel='Notifications'
          onRequestClose={this.closeModal}
        >
          <Notifications closeModal={this.closeModal} profile={user}/>
        </RightModal>

        <CenterModal
          isOpen={this.state.modal === 'faq'}
          contentLabel='FAQ'
          onRequestClose={this.closeModal}
        >
          <FAQ closeModal={this.closeModal} toggleModal={this.toggleModal}/>
        </CenterModal>
        <CenterModal
          isOpen={this.state.modal === 'terms'}
          contentLabel='Terms & Conditions'
          onRequestClose={this.closeModal}
        >
          <TermsAndConditions closeModal={this.closeModal} toggleModal={this.toggleModal}/>
        </CenterModal>                        

      </ImageWrapper>
    )
  }
}
