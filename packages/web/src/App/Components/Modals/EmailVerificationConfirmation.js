import React from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import PropTypes from 'prop-types'

import UXActions from '../../Redux/UXRedux'
import {
  Container,
  Title,
  Text,
  ExteriorCloseXContainer,
} from './Shared'
import Icon from '../../Components/Icon'
import RoundedButton from '../RoundedButton'
import { Row } from '../FlexboxGrid'
import onClickOutside from 'react-onclickoutside'

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

  handleClickOutside = (e) => {
    e.preventDefault()
    this.closeModal()
  }

  render() {
    return (
      <Container>
        <ExteriorCloseXContainer>
          <Icon
            name='closeWhite'
            onClick={this.handleClickOutside}
          />
        </ExteriorCloseXContainer>
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
    reroute: (path) => dispatch(push(path)),
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(EmailVerificationConfirmation))
