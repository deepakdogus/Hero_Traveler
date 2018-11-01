import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'
import './Styles/RightModalStyles.css'

export default class RightModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    contentLabel: PropTypes.string,
    onRequestClose: PropTypes.func,
  }
  render () {
    return (
      <Modal
        {...this.props}
        className="right-modal"
        overlayClassName="overlay"
        >
        {this.props.children}
      </Modal>
    )
  }
}
