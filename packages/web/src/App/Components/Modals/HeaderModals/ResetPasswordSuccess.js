import React from 'react'
import PropTypes from 'prop-types'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import UXActions from '../../../Redux/UXRedux'
import RoundedButton from '../../RoundedButton'
import { Row } from '../../FlexboxGrid'
import { Container, Title } from '../../Modals/Shared'

class ResetPasswordSuccess extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    openGlobalModal: PropTypes.func,
    reroute: PropTypes.func,
  };

  _handleOkay = e => {
    e.preventDefault()

    const { reroute, openGlobalModal, path } = this.props
    reroute(path)
    openGlobalModal('login')
  };

  render() {
    return (
      <Container>
        <Title>Your password has been updated.</Title>

        <Row center="xs">
          <RoundedButton
            onClick={this._handleOkay}
            text="OK"
            width="100%"
            margin="none"
            height="39px"
          />
        </Row>
      </Container>
    )
  }
}

function mapStateToProps(state) {
  return {
    path: state.ux.params.path,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    reroute: path => dispatch(push(path)),
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ResetPasswordSuccess)
