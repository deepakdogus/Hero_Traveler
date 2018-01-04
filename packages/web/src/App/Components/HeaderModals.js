import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

import Login from './Modals/HeaderModals/Login'
import Signup from './Modals/HeaderModals/Signup'
import ResetPassword from './Modals/HeaderModals/ResetPassword'
import Contributor from './Modals/HeaderModals/Contributor'
import AddToItinerary from './Modals/HeaderModals/AddToItinerary'
import Comments from './Modals/HeaderModals/Comments'
import Settings from './Modals/Settings'
import FAQTermsAndConditions from './Modals/FAQTermsAndConditions'
import Inbox from './Modals/Inbox'
import RightModal from './RightModal'
import CenterModal from './CenterModal'
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
    globalModalThatIsOpen: PropTypes.string,
    globalModalParams: PropTypes.object,
    modal: PropTypes.string,
    closeModal: PropTypes.func,
    closeGlobalModal: PropTypes.func,
    openSignupModal: PropTypes.func,
    attemptLogin: PropTypes.func,
    openLoginModal: PropTypes.func,
    user: PropTypes.string, // actually just a userId
    attemptChangePassword: PropTypes.func,     
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.object,
  }
  closeGlobalModal = () => {
    this.props.closeGlobalModal()
  }
  render() {
    const { globalModalThatIsOpen, loginReduxFetching, loginReduxError,
      closeModal, modal, globalModalParams, attemptChangePassword, user } = this.props
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
          isOpen={globalModalThatIsOpen === 'comments'}
          contentLabel='Comments Modal'
          onRequestClose={this.closeGlobalModal}
        >
          <Comments
            closeModal={this.closeGlobalModal}
            storyId={globalModalParams.storyId}
          />
        </RightModal>
        <RightModal
          isOpen={globalModalThatIsOpen === 'settings'}
          contentLabel='Settings Modal'
          onRequestClose={this.closeGlobalModal}
        >
          <Settings
            closeModal={this.closeGlobalModal}
            attemptChangePassword={attemptChangePassword}
            loginReduxFetching={loginReduxFetching}
            loginReduxError={loginReduxError}
            userId={user}
          />
        </RightModal>
        <CenterModal
          isOpen={globalModalThatIsOpen === 'faqTermsAndConditions'}
          contentLabel='FAQ Terms & Conditions'
          onRequestClose={this.closeGlobalModal}
        >
          <FAQTermsAndConditions closeModal={this.closeGlobalModal}/>
        </CenterModal>
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
