import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types'

import UXActions from '../../Redux/UXRedux'

import OnClickOutsideModal from './OnClickOutsideModal'
import {
  Title,
  Text,
} from './Shared'
import RoundedButton from '../../Shared/Web/Components/RoundedButton'
import { Row } from '../../Shared/Web/Components/FlexboxGrid'

class EmailVerificationConfirmation extends React.Component {
  static propTypes = {
    path: PropTypes.string,
    reroute: PropTypes.func,
    closeGlobalModal: PropTypes.func,
  }

  closeModal = () => {
    const {path, reroute, closeGlobalModal} = this.props
    reroute(path)
    closeGlobalModal()
  }

  render() {
    return (
      <OnClickOutsideModal>
        <Title>Email Verification</Title>
        <Text>Your email has been verified</Text>
        <Row center='xs'>
          <RoundedButton
            text='Close'
            margin='small'
            type='submit'
            onClick={this.closeModal}
          />
        </Row>
      </OnClickOutsideModal>
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
    reroute: (path) => dispatch(push(path)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EmailVerificationConfirmation)
