import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { connect } from 'react-redux'
import {push} from 'react-router-redux'
import * as _ from 'lodash'
import { Grid } from '../Components/FlexboxGrid'
import HeaderAnonymous from '../Components/Headers/HeaderAnonymous'
import HeaderLoggedIn from '../Components/Headers/HeaderLoggedIn'
import LoginActions from '../Shared/Redux/LoginRedux'
import UXActions from '../Redux/UXRedux'
import HeaderModals from '../Components/HeaderModals'
import UserActions from '../Shared/Redux/Entities/Users'

// If we don't explicity prevent 'fixed' from being passed to Grid, we get an error about unknown prop on div element
// because apparently react-flexbox-grid passes all props down to underlying React elements
const StyledGrid = styled(({ fixed, ...rest }) => <Grid {...rest} />)`
  padding: 15px;
  z-index: 3;
  position: ${props => props.fixed ? 'fixed' : 'absolute'};
  width: 100%;
  top: 0;
  padding-right: 10px;
  background-color: ${props => props.blackBackground ? '#1a1c21' : 'rgba(0,0,0,0)'};
`

const StyledGridBlack = styled(StyledGrid)`
  background-color: ${props => props.theme.Colors.background};
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
    activitiesById: PropTypes.array,
    activities: PropTypes.object,
    stories: PropTypes.object,
    markSeen: PropTypes.func,
    users: PropTypes.object
  }

  constructor(props) {
    super(props)
    this.state = {
      modal: undefined,
      navbarEngaged: false,
    }
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll)
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }

  handleScroll = (event) => {
    // If header is transparent, it should mark itself as "engaged" so we know to style it differently (aka black background)
    if (!this.props.blackHeader){
      if (window.scrollY > 65 && !this.state.navbarEngaged){
        this.setState({ navbarEngaged: true })
      } else if (window.scrollY < 65 && this.state.navbarEngaged) {
        this.setState({ navbarEngaged: false })
      }
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
  openModal = (event) => {
    const name = event.target.name
    let modalToOpen;
    if (name === 'inbox' || name === 'loginEmail') modalToOpen = 'inbox'
    else if (name === 'notifications' || name === 'cameraFlash') modalToOpen = 'notificationsThread'
    this.setState({ modal: modalToOpen })
  }

  closeModal = () => {
    this.setState({ modal: undefined })
  }

  render () {
    const { isLoggedIn,
            attemptLogin,
            closeGlobalModal,
            currentUser,
            globalModalThatIsOpen,
            globalModalParams,
            activities,
            activitiesById,
            markSeen,
            stories,
            reroute,
            users, } = this.props
    const SelectedGrid = (this.props.blackHeader || this.state.navbarEngaged) ? StyledGridBlack : StyledGrid
    const spacerSize = this.props.blackHeader ? '65px' : '0px'
    return (
      <div>
        <SelectedGrid fluid fixed>
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
              activitiesById={activitiesById}
              activities={activities}
              stories={stories}
              markSeen={markSeen}
              reroute={reroute}
              users={users}
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
    activitiesById: state.entities.users.activitiesById,
    activities: state.entities.users.activities,
    globalModalThatIsOpen: state.ux.modalName,
    globalModalParams: state.ux.params,
    users: state.entities.users.entities,
    stories: state.entities.stories.entities,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
    markSeen: (activityId) => dispatch(UserActions.activitySeen(activityId)),
    reroute: (path) => dispatch(push(path)),
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Header)
