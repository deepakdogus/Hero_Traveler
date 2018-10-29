import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import RightModal from '../RightModal'
import ProfileHeaderView from './ProfileHeaderView'
import ProfileHeaderEdit from './ProfileHeaderEdit'

import FollowFollowing from '../Modals/FollowFollowing'
import ProfileStats from '../Modals/ProfileStats'
import LikedBy from '../Modals/LikedBy'
import SendTo from '../Modals/SendTo'
import CreateBoard from '../Modals/CreateBoard'
import Inbox from '../Modals/Inbox'
import InboxThread from '../Modals/InboxThread'
import ProfileBio from '../Modals/ProfileBio'

const Container = styled.div``

export default class ProfileHeader extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    isEdit: PropTypes.bool,
    isUsersProfile: PropTypes.bool,
    toProfileView: PropTypes.func,
    openGlobalModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
    }
  }

  componentDidMount = () => {
    const { isEdit, isUsersProfile, toProfileView } = this.props
    if (isEdit && !isUsersProfile) toProfileView()
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  openFollowedByModal = () => this.setState({ modal: 'followedBy' })
  openFollowingModal = () => this.setState({ modal: 'following' })
  openBioModal = () => this.setState({modal: 'profileBio'})
  openInboxModal = () => this.setState({modal: 'inbox'})
  openContributor = () => this.props.openGlobalModal('contributor')

  render () {
    const {user, isEdit } = this.props
    return (
      <Container>
        {isEdit && <ProfileHeaderEdit {...this.props}/>}
        {!isEdit &&
          <ProfileHeaderView
            {...this.props}
            openBio={this.openBioModal}
            openContributor={this.openContributor}
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
          isOpen={this.state.modal === 'createBoard'}
          contentLabel='Create Board'
          onRequestClose={this.closeModal}
        >
          <CreateBoard closeModal={this.closeModal} profile={user}/>
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
      </Container>
    )
  }
}
