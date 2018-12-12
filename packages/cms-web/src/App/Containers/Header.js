import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import * as _ from 'lodash'

import HeaderLoggedIn from '../Components/Headers/HeaderLoggedIn'
import { Grid } from '../Components/FlexboxGrid'
import { sizes } from '../Themes/Metrics'
import UXActions from '../Redux/UXRedux'

import SessionActions from '../Shared/Redux/SessionRedux'

/*global branch*/

// If we don't explicity prevent 'fixed' from being passed to Grid, we get an error about unknown prop on div element
// because apparently react-flexbox-grid passes all props down to underlying React elements
const StyledGrid = styled(({ fixed, hasBlackBackground, ...rest }) => <Grid {...rest} />)`
  padding: 15px;
  z-index: 3;
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  width: 100%;
  top: 0;
  padding-right: 10px;
  background-color: ${props => props.hasBlackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

const HeaderSpacer = styled.div`
  height: ${props => props.spacerSize};
`

class Header extends React.Component {
  static propTypes = {
    currentUserId: PropTypes.string,
    currentUserProfile: PropTypes.object,
    currentUserEmail: PropTypes.string,
    isLoggedIn: PropTypes.bool,
    blackHeader: PropTypes.bool,
    attemptLogout: PropTypes.func,
    reroute: PropTypes.func,
    pathname: PropTypes.string,
    signedUp: PropTypes.bool,
    closeGlobalModal: PropTypes.func,
    openGlobalModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
      navbarEngaged: false,
      nextPathAfterSave: undefined,
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize)
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillMount() {
    this.handleWindowResize()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize)
    window.removeEventListener('scroll', this.handleScroll)
  }

  shouldDisengageNavbar = () => {
    return window.scrollY < 65
    && this.state.navbarEngaged
    && window.innerWidth >= sizes.tablet
  }

  handleWindowResize = event => {
    let windowWidth = window.innerWidth
    const tabletSize = sizes.tablet
    if (windowWidth <= tabletSize) {
      this.setState({ navbarEngaged: true })
    }
    else if (this.shouldDisengageNavbar()) {
      this.setState({ navbarEngaged: false })
    }
  }

  handleScroll = event => {
    // If header is transparent, it should mark itself as "engaged" so we know to style it differently (aka black background)
    if (!this.props.blackHeader) {
      if (window.scrollY > 65 && !this.state.navbarEngaged) {
        this.setState({ navbarEngaged: true })
      }
      else if (this.shouldDisengageNavbar()) {
        this.setState({ navbarEngaged: false })
      }
    }
  }

  render() {
    const {
      attemptLogout,
      currentUserId,
      reroute,
      pathname,
      openGlobalModal,
      closeGlobalModal
    } = this.props

    const spacerSize = '65px'

    return (
      <div>
        <StyledGrid fluid fixed hasBlackBackground>
          <HeaderLoggedIn
            userId={currentUserId}
            pathname={pathname}
            reroute={reroute}
            attemptLogout={attemptLogout}
            openGlobalModal={openGlobalModal}
            closeGlobalModal={closeGlobalModal}
          />
        </StyledGrid>
        <HeaderSpacer spacerSize={spacerSize} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  const pathname = state.routes.location ? state.routes.location.pathname : ''
  const users = state.entities.users.entities
  const currentUserId = state.session.userId
  const currentUser = users[currentUserId]

  return {
    isLoggedIn: !state.session.isLoggedOut,
    loginReduxError: state.login.error,
    blackHeader: _.includes(['/', '/feed', ''], pathname) ? false : true,
    globalModalThatIsOpen: state.ux.modalName,
    globalModalParams: state.ux.params,
    currentUserId: currentUserId,
    currentUserProfile: currentUser && currentUser.profile,
    currentUserEmail: currentUser && currentUser.email,
    pathname: pathname,
    signedUp: state.signup.signedUp,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogout: tokens => dispatch(SessionActions.logout(tokens)),
    reroute: route => dispatch(push(route)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header)
