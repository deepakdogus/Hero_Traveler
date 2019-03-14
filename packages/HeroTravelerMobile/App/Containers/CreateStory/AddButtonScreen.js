import React, { Component } from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import PropTypes from 'prop-types'
import { Actions as NavActions } from 'react-native-router-flux'

import NavBar from './NavBar'
import Checkbox from '../../Components/Checkbox'
import FormInput from '../../Components/FormInput'
import Modal from '../../Components/Modal'

import styles from './AddButtonScreenStyles'
import modalStyles, { modalWrapperStyles } from './2_StoryCoverScreenStyles'

export default class AddButtonScreen extends Component {
  static propTypes = {
    onAddButton: PropTypes.func,
    buttonType: PropTypes.string,
    link: PropTypes.string,
  }

  state = {
    type: this.props.buttonType || 'info',
    link: this.props.link || '',
    hasAttemptedSubmit: false,
    hasDeletedButton: false,
    activeModal: undefined,
  }

  setMoreInfoType = () => this.setState({ type: 'info' })

  setBookNowType = () => this.setState({ type: 'booking' })

  setSignupType = () => this.setState({ type: 'signup' })

  handleChangeText = link => this.setState({ link: link.trim() })

  handleDeleteButton = () => this.setState({ activeModal: 'confirmDeleteButton'})

  handleDeleteConfirm = () => {
    this.setState({ link: '', type: '', hasDeletedButton: true })
    this.closeModal()
  }

  onLeft = () => NavActions.pop()

  onRight = () => {
    const { type, link } = this.state

    this.setState({ hasAttemptedSubmit: true })
    if (this.isValid()) {
      if (this.state.link === '' && this.state.hasDeletedButton) {
        this.props.onAddButton({ type: '', link: '' })
      }
      else {
        this.props.onAddButton({ type, link })
      }
      NavActions.pop()
    }
  }

  // doesn't validate well after domain, allows any TLD
  isValidURL = () => {
    const pattern = new RegExp(
      '^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        + '(\\#[-a-z\\d_]*)?$',
      'i',
    )
    return !!pattern.test(this.state.link)
  }

  isValid = () => {
    return (
      (this.state.type && this.state.link && this.isValidURL())
      || (!this.state.link && this.state.hasDeletedButton)
    )
  }

  closeModal = () => this.setState({activeModal: undefined})

  renderConfirmDeleteButton = () => {
    const title = 'Delete Button'
    const message = 'Are you sure you want to delete your button?'
    return (
      <Modal
        closeModal={this.closeModal}
        modalStyle={modalWrapperStyles}
      >
        <Text style={modalStyles.modalTitle}>{title}</Text>
        <Text style={modalStyles.modalMessage}>{message}</Text>
        <View style={modalStyles.modalBtnWrapper}>
          <TouchableOpacity
            style={[modalStyles.modalBtn, modalStyles.modalBtnLeft]}
            onPress={this.handleDeleteConfirm}
          >
            <Text style={modalStyles.modalBtnText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={modalStyles.modalBtn}
            onPress={this.closeModal}
          >
            <Text style={modalStyles.modalBtnText}>No</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    )
  }

  render = () => (
    <View style={styles.root}>
      <NavBar
        title="ADD A BUTTON"
        onLeft={this.onLeft}
        leftTitle="Cancel"
        onRight={this.onRight}
        isRightValid={this.isValid()}
        rightTitle="Done"
        rightTextStyle={styles.navBarRightTextStyle}
        style={styles.navBarStyle}
      />
      <View style={styles.content}>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Choose a button:</Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>More info button</Text>
            <Checkbox
              checked={this.state.type === 'info'}
              onPress={this.setMoreInfoType}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>Book now button</Text>
            <Checkbox
              checked={this.state.type === 'booking'}
              onPress={this.setBookNowType}
            />
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.buttonRow}>
            <Text style={styles.buttonText}>Sign up button</Text>
            <Checkbox
              checked={this.state.type === 'signup'}
              onPress={this.setSignupType}
            />
          </View>
        </View>
        <View style={styles.labelRow}>
          <Text style={styles.label}>Add a Url to your button:</Text>
        </View>
        <FormInput
          autoCapitalize="none"
          onChangeText={this.handleChangeText}
          onSubmitEditing={this.onRight}
          placeholder="Enter Url"
          keyboardType="url"
          returnKeyType="done"
          value={this.state.link}
        />
        {!!this.state.link
          && this.state.hasAttemptedSubmit
          && !this.isValidURL() && (
            <View style={styles.errorRow}>
              <Text style={styles.errorText}>
                Please make sure your Url is valid
              </Text>
            </View>
          )}
        {!!this.props.link
          && this.props.link === this.state.link
          && !this.state.hasDeletedButton && (
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={this.handleDeleteButton}
            >
              <Text style={styles.deleteText}>Delete button</Text>
            </TouchableOpacity>
        )}
      </View>
      {this.state.activeModal === 'confirmDeleteButton' && this.renderConfirmDeleteButton()}
    </View>
  )
}
