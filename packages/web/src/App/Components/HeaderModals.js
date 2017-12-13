import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

import Login from './Modals/HeaderModals/Login'
import Signup from './Modals/HeaderModals/Signup'
import ResetPassword from './Modals/HeaderModals/ResetPassword'
import Contributor from './Modals/HeaderModals/Contributor'
import AddToItinerary from './Modals/HeaderModals/AddToItinerary'
import Comments from './Modals/HeaderModals/Comments'
import Inbox from './Modals/Inbox'
import RightModal from './RightModal'
import NotificationsThread from './Modals/NotificationsThread'

const customModalStyles = {
  content: {
    width: 420,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)',
    zIndex: 100,
  }
}

const contributorModalStyles = {
  content: {
    width: 380,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)'
  }
}

const addToItineraryModalStyles = {
  content: {
    width: 600,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)'
  }
}

export default class HeaderModals extends React.Component {
  static propTypes = {
    modalThatIsOpen: PropTypes.string,
    modal: PropTypes.string,
    closeModal: PropTypes.func,
    openSignupModal: PropTypes.func,
    attemptLogin: PropTypes.func,
    openLoginModal: PropTypes.func,
    user: PropTypes.object,
  }
  closeGlobalModal = () => {
    console.log('Need to make an action for closing this')
  }
  render() {
    const { modalThatIsOpen, closeModal, modal } = this.props
    return (
      <div>
        <Modal
          isOpen={modal === 'login'}
          contentLabel="Login Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <Login
            onSignupClick={this.props.openSignupModal}
            onAttemptLogin={this.props.attemptLogin}
          />
        </Modal>
        <Modal
          isOpen={modal === 'signup'}
          contentLabel="Signup Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <Signup onLoginClick={this.props.openLoginModal}/>
        </Modal>
        <Modal
          isOpen={modal === 'resetPassword'}
          contentLabel="Reset Password Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <ResetPassword/>
        </Modal>
        <Modal
          isOpen={modal === 'contributor'}
          contentLabel="Reset Password Modal"
          onRequestClose={closeModal}
          style={contributorModalStyles}
        >
          <Contributor/>
        </Modal>
        <Modal
          isOpen={modal === 'addToItinerary'}
          contentLabel="Add To Itinerary Modal"
          onRequestClose={closeModal}
          style={addToItineraryModalStyles}
        >
          <AddToItinerary/>
        </Modal>
        <RightModal
          isOpen={modal === 'notificationsThread'}
          contentLabel='Notifications Thread'
          onRequestClose={closeModal}
        >
          <NotificationsThread closeModal={closeModal} profile={this.props.user}/>
        </RightModal>
        <RightModal
          isOpen={modalThatIsOpen === 'comments'}
          contentLabel='Comments Modal'
          onRequestClose={this.closeGlobalModal}
        >
          <Comments
            closeModal={this.closeGlobalModal}
            storyId={'5a04bdfd0420ae05a656c57c'}
          />
        </RightModal>
        <RightModal
          isOpen={modal === 'inbox'}
          contentLabel='Inbox'
          onRequestClose={closeModal}
        >
          <Inbox closeModal={closeModal} profile={this.props.user}/>
        </RightModal>
      </div>
    )
  }
}
