import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Modal from 'react-modal'

import RightModal from '../RightModal'
import CenterModal from '../CenterModal'
import ProfileHeaderView from './ProfileHeaderView'
import ProfileHeaderEdit from './ProfileHeaderEdit'

import FollowFollowing from '../Modals/FollowFollowing'
import ProfileStats from '../Modals/ProfileStats'
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
import Contributor from '../Modals/HeaderModals/Contributor'

const Container = styled.div``

const contributorModalStyles = {
  content: {
    width: 380,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)',
    zIndex: 3,
  }
}

export default class ProfileHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isContributor: PropTypes.bool,
    isEdit: PropTypes.bool,
    isUsersProfile: PropTypes.bool,
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

  openFollowedByModal = () => this.setState({ modal: 'followedBy' })
  openFollowingModal = () => this.setState({ modal: 'following' })
  openBioModal = () => this.setState({modal: 'profileBio'})
  openContributorModal = () => this.setState({modal: 'contributor'})
  openInboxModal = () => this.setState({modal: 'inbox'})

  render () {
    const {user, isEdit } = this.props
    return (
      <Container>
        {isEdit && <ProfileHeaderEdit {...this.props}/>}
        {!isEdit &&
          <ProfileHeaderView
            {...this.props}
            openBio={this.openBioModal}
            openContributor={this.openContributorModal}
            openFollowedBy={this.openFollowedByModal}
            openFollowing={this.openFollowingModal}
          />}

        <RightModal
          isOpen={this.state.modal === 'followedBy' || this.state.modal === 'following'}
          contentLabel='Followed By Modal'
          onRequestClose={this.closeModal}
        >
          <FollowFollowing
            closeModal={this.closeModal}
            followersType={this.state.modal === 'following' ? 'following' : 'followers'}
            profile={user}
          />
        </RightModal>
        <RightModal
          isOpen={this.state.modal === 'stats'}
          contentLabel='User Stats Modal'
          onRequestClose={this.closeModal}
        >
          <ProfileStats closeModal={this.closeModal} profile={user}/>
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
        <Modal
          isOpen={this.state.modal === 'contributor'}
          contentLabel='Contributor'
          onRequestClose={this.closeModal}
          style={contributorModalStyles}
        >
          <Contributor/>
        </Modal>
      </Container>
    )
  }
}
