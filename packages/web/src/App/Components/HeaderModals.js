import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

import Login from './Modals/HeaderModals/Login'
import Signup from './Modals/HeaderModals/Signup'
import SaveEdits from './Modals/HeaderModals/SaveEdits'
import ResetPassword from './Modals/HeaderModals/ResetPassword'
import Contributor from './Modals/HeaderModals/Contributor'
import AddToItinerary from './Modals/HeaderModals/AddToItinerary'
import Comments from './Modals/HeaderModals/Comments'
import Inbox from './Modals/Inbox'
import RightModal from './RightModal'
import NotificationsThread from './Modals/NotificationsThread'

const customModalStyles = {
  content: {
    border: '0',
    bottom: 'auto',
    minHeight: '10rem',
    left: '50%',
    padding: '2rem',
    position: 'fixed',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%,-50%)',
    minWidth: '20rem',
    maxWidth: '28rem',
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
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    stories: PropTypes.object,
    markSeen: PropTypes.func,
    reroute: PropTypes.func,
    users: PropTypes.object,
    nextPathAfterSave: PropTypes.string,
  }

  closeGlobalModal = () => {
    this.props.closeGlobalModal()
  }

  render() {
    const {
      globalModalThatIsOpen,
      closeModal,
      modal,
      globalModalParams,
      activities,
      activitiesById,
      markSeen,
      reroute,
      stories,
      users,
      nextPathAfterSave,
    } = this.props

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
        <Modal
          isOpen={modal=== 'saveEdits'}
          contentLabel="Save Edits Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <SaveEdits
            reroute={reroute}
            nextPathAfterSave={nextPathAfterSave}
            closeModal={closeModal}
          />
        </Modal>
        <RightModal
          isOpen={modal === 'notificationsThread'}
          contentLabel='Notifications Thread'
          onRequestClose={closeModal}
        >
          <NotificationsThread
            closeModal={closeModal}
            activities={activities}
            activitiesById={activitiesById}
            markSeen={markSeen}
            stories={stories}
            reroute={reroute}
            users={users}
            />
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
