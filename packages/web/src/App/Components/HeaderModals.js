import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import _ from 'lodash'

import styled from 'styled-components'
// Default Modals
import Login from './Modals/HeaderModals/Login'
import Signup from './Modals/HeaderModals/Signup'
import SaveEdits from './Modals/HeaderModals/SaveEdits'
import ExistingUpdateWarning from './Modals/HeaderModals/ExistingUpdateWarning'
import ResetPasswordRequest from './Modals/HeaderModals/ResetPasswordRequest'
import ResetPasswordAttempt from './Modals/HeaderModals/ResetPasswordAttempt'
import ChangeTempUsername from './Modals/ChangeTempUsername'
import Contributor from './Modals/HeaderModals/Contributor'
import FlagStory from './Modals/FlagStory'
import DeleteFeedItem from './Modals/DeleteFeedItem'
import RemoveStoryFromGuide from './Modals/RemoveStoryFromGuide'
import EmailVerificationConfirmation from './Modals/EmailVerificationConfirmation'
import ErrorModal from './Modals/ErrorModal'

// Right Modals
import RightModal from './RightModal'
import Settings from './Modals/Settings'
import NotificationsThread from './Modals/NotificationsThread'
import Comments from './Modals/HeaderModals/Comments'
import Inbox from './Modals/Inbox'
import AddStoryToGuides from './Modals/AddStoryToGuides'
// Center Modals
import CenterModal from './CenterModal'
import Documentation from './Modals/Documentation'

const Container = styled.div``

const customModalStyles = {
  content: {
    border: '0',
    bottom: 'auto',
    minHeight: '10rem',
    left: '50%',
    position: 'fixed',
    right: 'auto',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '20rem',
    maxWidth: '28rem',
    overflow: 'visible',
    padding: '0',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, .5)',
    zIndex: 100,
  },
}

const contributorModalStyles = _.merge(
  {},
  customModalStyles,
  {
    content: {
      maxWidth: '380px',
      padding: '1em',
    },
  },
)

export default class HeaderModals extends React.Component {
  static propTypes = {
    globalModalThatIsOpen: PropTypes.string,
    globalModalParams: PropTypes.object,
    modal: PropTypes.string,
    closeModal: PropTypes.func,
    closeGlobalModal: PropTypes.func,
    userId: PropTypes.string,
    currentUserProfile: PropTypes.object,
    currentUserEmail: PropTypes.string,
    currentUserNotificationTypes: PropTypes.arrayOf(PropTypes.string),
    attemptChangePassword: PropTypes.func,
    loginReduxFetching: PropTypes.bool,
    loginReduxError: PropTypes.object,
    attemptUpdateUser: PropTypes.func,
    userEntitiesUpdating: PropTypes.bool,
    userEntitiesError: PropTypes.object,
    reroute: PropTypes.func,
    nextPathAfterSave: PropTypes.string,
    attemptLogout: PropTypes.func,
    resetCreateStore: PropTypes.func,
    flagStory: PropTypes.func,
    deleteStory: PropTypes.func,
    openGlobalModal: PropTypes.func,
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
      reroute,
      nextPathAfterSave,
      attemptLogout,
      resetCreateStore,
      flagStory,
    } = this.props

    //destructuring these as let so we can reassign message in respective components
    let {
      loginReduxFetching,
      loginReduxError,
    } = this.props

    return (
      <Container>
        <Modal
          isOpen={globalModalThatIsOpen === 'login'}
          contentLabel="Login Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <Login />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'signup'}
          contentLabel="Signup Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <Signup />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'resetPasswordRequest'}
          contentLabel="Reset Password Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <ResetPasswordRequest />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'resetPasswordAttempt'}
          contentLabel="Reset Password Modal"
          style={customModalStyles}
        >
          <ResetPasswordAttempt />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'contributor'}
          contentLabel='Contributor'
          onRequestClose={closeModal}
          style={contributorModalStyles}
        >
          <Contributor closeGlobalModal={closeGlobalModal} />
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
          isOpen={globalModalThatIsOpen === 'existingUpdateWarning'}
          contentLabel="Existing Draft"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <ExistingUpdateWarning closeModal={closeGlobalModal} />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'deleteFeedItem'}
          contentLabel="Delete Story Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <DeleteFeedItem closeModal={closeGlobalModal} />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'flagStory'}
          contentLabel="Flag Story Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <FlagStory
            closeModal={closeGlobalModal}
            reroute={reroute}
            userId={userId}
            flagStory={flagStory}
            params={globalModalParams}
          />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'changeTempUsername'}
          contentLabel="Flag Story Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <ChangeTempUsername
            closeModal={closeGlobalModal}
          />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'emailVerificationConfirmation'}
          contentLabel="Flag Story Modal"
          style={customModalStyles}
        >
          <EmailVerificationConfirmation />
        </Modal>
        <Modal
          isOpen={globalModalThatIsOpen === 'error'}
          contentLabel="Error Modal"
          onRequestClose={closeModal}
          style={customModalStyles}
        >
          <ErrorModal closeModal={closeGlobalModal} />
        </Modal>

        <RightModal
          isOpen={globalModalThatIsOpen === 'notificationsThread'}
          contentLabel='Notifications Thread'
          onRequestClose={closeModal}
        >
          <NotificationsThread closeModal={closeGlobalModal}/>
        </RightModal>
        <RightModal
          isOpen={globalModalThatIsOpen === 'comments'}
          contentLabel='Comments Modal'
          onRequestClose={closeGlobalModal}
        >
          <Comments
            closeModal={closeGlobalModal}
            reroute={reroute}
            storyId={globalModalParams.storyId}
            guideId={globalModalParams.guideId}
          />
        </RightModal>
        <RightModal
          isOpen={globalModalThatIsOpen === 'settings'}
          contentLabel='Settings Modal'
        >
          <Settings
            closeModal={closeGlobalModal}
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
        <RightModal
          isOpen={globalModalThatIsOpen === 'guidesSelect'}
          contentLabel='Add to a guide'
        >
          <AddStoryToGuides storyId={globalModalParams.storyId} />
        </RightModal>
        <Modal
          isOpen={globalModalThatIsOpen === 'guideStoryRemove'}
          contentLabel='Remove Story From Guide'
          style={customModalStyles}
        >
          <RemoveStoryFromGuide
            closeModal={closeGlobalModal}
          />
        </Modal>
        <CenterModal
          isOpen={globalModalThatIsOpen === 'documentation'}
          contentLabel='Documentation'
        >
          <Documentation />
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
