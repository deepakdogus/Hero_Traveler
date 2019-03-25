import { Component } from 'react'
import PropTypes from 'prop-types'

import isValidUrl from '../Lib/isValidUrl'

export default class AddButtonScreen extends Component {
  static propTypes = {
    currentLink: PropTypes.string,
    buttonType: PropTypes.string,
    updateWorkingDraft: PropTypes.func,
  }

  state = {
    type: this.props.buttonType || 'info',
    link: this.props.currentLink || '',
    hasAttemptedSubmit: false,
    hasDeletedButton: false,
    // activeModal: undefined,
  }

  setMoreInfoType = () => this.setState({ type: 'info' })

  setBookNowType = () => this.setState({ type: 'booking' })

  setSignupType = () => this.setState({ type: 'signup' })

  handleChangeText = () => {
    throw new Error('You must implement the method handleChangeText in your subclass')
  }

  handleDeleteButton = () => {
    throw new Error('You must implement the method handleDeleteButton in your subclass')
  }

  isValidUrl = link => isValidUrl(link)

  isValid = link => {
    return (
      (this.state.type && this.state.link && this.isValidUrl(link))
      || (!this.state.link && this.state.hasDeletedButton)
    )
  }
}
