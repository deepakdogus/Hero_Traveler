import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import Header from '../Header'
import HeaderImageWrapper from '../Headers/Shared/HeaderImageWrapper'
import RightModal from '../RightModal'
import CenterModal from '../CenterModal'
import {OverlayStyles} from '../Overlay'
import getImageUrl from '../../Shared/Lib/getImageUrl'
import ProfileHeaderView from './ProfileHeaderView'
import ProfileHeaderEdit from './ProfileHeaderEdit'

import FollowFollowing from '../Modals/FollowFollowing'
import ProfileStats from '../Modals/ProfileStats'
import Comments from '../Modals/Comments'
import LikedBy from '../Modals/LikedBy'
import SendTo from '../Modals/SendTo'
import AddToBoard from '../Modals/AddToBoard'
import CreateBoard from '../Modals/CreateBoard'
import Settings from '../Modals/Settings'
import Inbox from '../Modals/Inbox'
import InboxThread from '../Modals/InboxThread'
import NotificationsThread from '../Modals/NotificationsThread'
import FAQTermsAndConditions from '../Modals/FAQTermsAndConditions'
import ProfileBio from '../Modals/ProfileBio'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
  ${OverlayStyles}
`

export default class ProfileHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
    isEdit: PropTypes.bool,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
    }
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  openFollowedByModal = () => {
    this.setState({ modal: 'followedBy' })
  }

  render () {
    const {user, isEdit} = this.props
    const backgroundImage = getImageUrl(user.profile.cover)
    const ImageWrapper = backgroundImage ? OpaqueHeaderImageWrapper : HeaderImageWrapper
    return (
      <ImageWrapper
        backgroundImage={backgroundImage}
        size='large'
        type='profile'
      >
        <Header isLoggedIn></Header>
        {isEdit && <ProfileHeaderEdit {...this.props}/>}
        {!isEdit && <ProfileHeaderView {...this.props}/>}

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
