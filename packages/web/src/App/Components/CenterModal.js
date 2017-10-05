import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

const customModalStyles = {
  content: {
    maxWidth: 750,
    maxHeight: 600,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)',
    zIndex: 100,
  }
}

export default class CenterModal extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool,
    contentLabel: PropTypes.string,
    onRequestClose: PropTypes.func,
  }
  render () {
    return (
      <Modal
        {...this.props}
        style={customModalStyles}>
        {this.props.children}
      </Modal>
    )
  }
}
