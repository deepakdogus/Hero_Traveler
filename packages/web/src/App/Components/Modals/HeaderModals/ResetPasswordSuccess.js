import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import UXActions from '../../../Redux/UXRedux'
import RoundedButton from '../../../Shared/Web/Components/RoundedButton'
import { Row } from '../../../Shared/Web/Components/FlexboxGrid'
import { Container, Title, Text } from '../../Modals/Shared'

class ResetPasswordSuccess extends React.Component {
  static propTypes = {
    openGlobalModal: PropTypes.func,
  }

  _handleConfirm = e => {
    e.preventDefault()

    const { openGlobalModal } = this.props
    openGlobalModal('login')
  }

  render() {
    return (
      <Container>
        <Title>Success</Title>
        <Text>
          Your password has been updated.
        </Text>
        <Row center='xs'>
          <RoundedButton
            onClick={this._handleConfirm}
            text='LOGIN'
            width='100%'
            margin='none'
            height='39px'
          />
        </Row>
      </Container>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(ResetPasswordSuccess)
