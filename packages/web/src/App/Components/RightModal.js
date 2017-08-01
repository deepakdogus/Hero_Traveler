import React from 'react'
import PropTypes from 'prop-types'
import Modal from 'react-modal'

const customModalStyles = {
  content: {
    width: 570,
    top: 0,
    bottom: 0,
    right: 0,
    left: 'auto',
    padding: 0,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0, .5)'
  }
}

export default class Header extends React.Component {
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
