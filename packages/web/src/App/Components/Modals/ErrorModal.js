import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import OnClickOutsideModal from './OnClickOutsideModal'
import {
  Title,
  Text,
} from './Shared'

class ErrorModal extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    message: PropTypes.string,
  }

  render(){
    const { title, message } = this.props
    return (
      <OnClickOutsideModal>
        <Title>{title}</Title>
        <Text>{message}</Text>
      </OnClickOutsideModal>
    )
  }
}

function mapStateToProps(state) {
  return {
    ...state.ux.params,
  }
}

export default connect(
  mapStateToProps,
  null,
)(ErrorModal)
