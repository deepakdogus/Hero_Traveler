import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import * as _ from 'lodash'
import { Grid } from '../Components/FlexboxGrid'
import HeaderAnonymous from '../Components/Headers/HeaderAnonymous'
import HeaderLoggedIn from '../Components/Headers/HeaderLoggedIn'
import LoginActions from '../Shared/Redux/LoginRedux'
import UXActions from '../Redux/UXRedux'
import HeaderModals from '../Components/HeaderModals'

const StyledGrid = styled(Grid)`
  padding: 15px;
  z-index: 3;
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  width: 100%;
  top: 0;
  padding-right: 10px;
  background-color: ${props => props.blackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

const StyledGridBlack = styled(StyledGrid)`
  background-color: ${props => props.theme.Colors.background}
`

const HeaderSpacer = styled.div`
  height: ${props => props.spacerSize};
`

class Header extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
    blackHeader: PropTypes.bool,
    attemptLogin: PropTypes.func,
    closeGlobalModal: PropTypes.func,
    globalModalThatIsOpen: PropTypes.string,
    globalModalParams: PropTypes.object,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
    }
  }

  openLoginModal = () => {
    this.setState({ modal: 'login' })
  }

  openSignupModal = () => {
    this.setState({ modal: 'signup' })
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) this.closeModal()
  }

  // name correspond to icon name and button name
  openModal = (event, modalName) => {
    console.log('modalName', modalName)
    const name = event.target.name
    console.log('name', name, event.target)
    let modalToOpen;
    if (modalName) modalToOpen = modalName
    else if (name === 'inbox' || name === 'loginEmail') modalToOpen = 'inbox'
    else if (name === 'notifications' || name === 'cameraFlash') modalToOpen = 'notificationsThread'
    else modalToOpen = name
    this.setState({ modal: modalToOpen })
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  render () {
    const {isLoggedIn, attemptLogin, closeGlobalModal, currentUser, globalModalThatIsOpen, globalModalParams } = this.props
    const SelectedGrid = this.props.blackHeader ? StyledGridBlack : StyledGrid
    const spacerSize = this.props.blackHeader ? '65px' : '0px'
    return (
      <div>
        <SelectedGrid fluid>
          {isLoggedIn &&
          <HeaderLoggedIn
              user={currentUser}
              openModal={this.openModal}
          />
          }
          {!isLoggedIn &&
          <HeaderAnonymous
              openLoginModal={this.openLoginModal}
          />
          }
          <HeaderModals
              closeModal={this.closeModal}
              closeGlobalModal={closeGlobalModal}
              openSignupModal={this.openSignupModal}
              attemptLogin={attemptLogin}
              openLoginModal={this.openLoginModal}
              user={currentUser}
              modal={this.state.modal}
              globalModalThatIsOpen={globalModalThatIsOpen}
              globalModalParams={globalModalParams}
          />
      </SelectedGrid>
      <HeaderSpacer
          spacerSize={spacerSize}
      />
    </div>
  )
  }
}

function mapStateToProps(state) {
  const pathname = state.routes.location ? state.routes.location.pathname : ''
  return {
    isLoggedIn: state.login.isLoggedIn,
    blackHeader: _.includes(['/', '/feed', ''], pathname) ? false : true,
    currentUser: state.session.userId,
    globalModalThatIsOpen: state.ux.modalName,
    globalModalParams: state.ux.params,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)
