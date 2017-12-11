import React from 'react'
import Modal from 'react-modal'

import Login from './Modals/HeaderModals/Login'
import Signup from './Modals/HeaderModals/Signup'
import ResetPassword from './Modals/HeaderModals/ResetPassword'
import Contributor from './Modals/HeaderModals/Contributor'
import AddToItinerary from './Modals/HeaderModals/AddToItinerary'
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
  render() {
    return (
      <div>
        <Modal
          isOpen={this.props.modal === 'login'}
          contentLabel="Login Modal"
          onRequestClose={this.props.closeModal}
          style={customModalStyles}
        >
          <Login
            onSignupClick={this.props.openSignupModal}
            onAttemptLogin={this.props.attemptLogin}
          />
        </Modal>
        <Modal
          isOpen={this.props.modal === 'signup'}
          contentLabel="Signup Modal"
          onRequestClose={this.props.closeModal}
          style={customModalStyles}
        >
          <Signup onLoginClick={this.props.openLoginModal}/>
        </Modal>
        <Modal
          isOpen={this.props.modal === 'resetPassword'}
          contentLabel="Reset Password Modal"
          onRequestClose={this.props.closeModal}
          style={customModalStyles}
        >
          <ResetPassword/>
        </Modal>
        <Modal
          isOpen={this.props.modal === 'contributor'}
          contentLabel="Reset Password Modal"
          onRequestClose={this.props.closeModal}
          style={contributorModalStyles}
        >
          <Contributor/>
        </Modal>
        <Modal
          isOpen={this.props.modal === 'addToItinerary'}
          contentLabel="Add To Itinerary Modal"
          onRequestClose={this.props.closeModal}
          style={addToItineraryModalStyles}
        >
          <AddToItinerary/>
        </Modal>
        <RightModal
          isOpen={this.props.modal === 'notificationsThread'}
          contentLabel='Notifications Thread'
          onRequestClose={this.props.closeModal}
        >
          <NotificationsThread closeModal={this.props.closeModal} profile={this.props.user}/>
        </RightModal>
        <RightModal
          isOpen={this.props.modal === 'inbox'}
          contentLabel='Inbox'
          onRequestClose={this.props.closeModal}
        >
          <Inbox closeModal={this.props.closeModal} profile={this.props.user}/>
        </RightModal>
      </div>
    )
  }
}
