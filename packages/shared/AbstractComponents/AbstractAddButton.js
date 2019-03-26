import { Component } from 'react'
import PropTypes from 'prop-types'

import isValidUrl from '../Lib/isValidUrl'

export default class AbstractAddButton extends Component {
  static propTypes = {
    currentLink: PropTypes.string,
    buttonType: PropTypes.string,
    updateWorkingDraft: PropTypes.func.isRequired,
  }

  state = {
    type: this.props.buttonType || 'info',
    link: this.props.currentLink || '',
    hasAttemptedSubmit: false,
    hasDeletedButton: false,
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

  handleSubmit = (type, link ) => {
    this.setState({ hasAttemptedSubmit: true })
    if (this.isValid(link)) this.props.updateWorkingDraft({actionButton: { type, link }})
  }

  isValidUrl = link => isValidUrl(link)

  isValid = link => this.state.type && this.state.link && this.isValidUrl(link)
}
