import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

import styled from 'styled-components'
import Login from './Modals/HeaderModals/Login'
import Signup from './Modals/HeaderModals/Signup'
import SaveEdits from './Modals/HeaderModals/SaveEdits'
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
import FlagStory from './Modals/FlagStory'
import DeleteStory from './Modals/DeleteStory'

const Container = styled.div``

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
    userId: PropTypes.string,
    currentUserProfile: PropTypes.object,
    currentUserEmail: PropTypes.string,
    currentUserNotificationTypes: PropTypes.arrayOf(PropTypes.string),
    attemptChangePassword: PropTypes.func,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.object,
    signupReduxFetching: PropTypes.bool,
    signupReduxError: PropTypes.string,
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    stories: PropTypes.object,
    markSeen: PropTypes.func,
    reroute: PropTypes.func,
    users: PropTypes.object,
    nextPathAfterSave: PropTypes.string,
    attemptLogout: PropTypes.func,
    resetCreateStore: PropTypes.func,
    flagStory: PropTypes.func,
    deleteStory: PropTypes.func,
  }

  closeGlobalModal = () => {
    this.props.closeGlobalModal()
  }

  render() {
    const {
      globalModalThatIsOpen,
      closeGlobalModal,
      closeModal,
      modal,
      globalModalParams,
      attemptChangePassword,
      userId,
      attemptUpdateUser,
      userEntitiesUpdating,
      userEntitiesError,
      currentUserEmail,
      currentUserProfile,
      currentUserNotificationTypes,
      activities,
      activitiesById,
      markSeen,
      reroute,
      stories,
      users,
      nextPathAfterSave,
      attemptLogout,
      resetCreateStore,
      flagStory,
      deleteStory,
    } = this.props

    //destructuring these as let so we can reassign message in respective components
    let {
      loginReduxFetching,
      loginReduxError,
      signupReduxFetching,
      signupReduxError,
    } = this.props

    return (
      <Container>
        <Modal
          isOpen={modal === 'login'}
          contentLabel="Login Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <Login
            onSignupClick={this.props.openSignupModal}
            onAttemptLogin={this.props.attemptLogin}
            loginReduxFetching={loginReduxFetching}
            loginReduxError={loginReduxError}
          />
        </Modal>
        <Modal
          isOpen={modal === 'signup'}
          contentLabel="Signup Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <Signup
            onLoginClick={this.props.openLoginModal}
            signupReduxFetching={signupReduxFetching}
            signupReduxError={signupReduxError}
          />
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
          isOpen={globalModalThatIsOpen === 'saveEdits'}
          contentLabel="Save Edits Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <SaveEdits
            params={globalModalParams}
            reroute={reroute}
            nextPathAfterSave={nextPathAfterSave}
            closeModal={closeGlobalModal}
            attemptLogout={attemptLogout}
            resetCreateStore={resetCreateStore}
          />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'deleteStory'}
          contentLabel="Delete Story Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <DeleteStory
            reroute={reroute}
            closeModal={closeGlobalModal}
            deleteStory={deleteStory}
            resetCreateStore={resetCreateStore}
            userId={userId}
            globalModalParams={globalModalParams}
          />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'flagStory'}
          contentLabel="Flag Story Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <FlagStory
            closeModal={this.closeGlobalModal}
            reroute={reroute}
            userId={userId}
            flagStory={flagStory}
            params={globalModalParams}
          />
        </Modal>
        <RightModal
          isOpen={globalModalThatIsOpen === 'notificationsThread'}
          contentLabel='Notifications Thread'
          onRequestClose={closeModal}
        >
          <NotificationsThread
            closeModal={this.closeGlobalModal}
            activitiesById={activitiesById}
            activities={activities}
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
          isOpen={globalModalThatIsOpen === 'settings'}
          contentLabel='Settings Modal'
        >
          <Settings
            closeModal={this.closeGlobalModal}
            attemptChangePassword={attemptChangePassword}
            loginReduxFetching={loginReduxFetching}
            loginReduxError={loginReduxError}
            attemptUpdateUser={attemptUpdateUser}
            userEntitiesUpdating={userEntitiesUpdating}
            userEntitiesError={userEntitiesError}
            userId={userId}
            userProfile={currentUserProfile}
            userEmail={currentUserEmail}
            userNotificationTypes={currentUserNotificationTypes}
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
          <Inbox closeModal={closeModal} profile={currentUserProfile}/>
        </RightModal>
      </Container>
    )
  }
}
