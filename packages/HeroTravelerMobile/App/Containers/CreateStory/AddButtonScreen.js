import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import { Actions as NavActions } from 'react-native-router-flux'

import { AbstractAddButton } from '../../Shared/AbstractComponents'
import NavBar from './NavBar'
import Checkbox from '../../Components/Checkbox'
import FormInput from '../../Components/FormInput'
import Modal from '../../Components/Modal'

import styles from './AddButtonScreenStyles'
import modalStyles, { modalWrapperStyles } from './2_StoryCoverScreenStyles'

export default class AddButtonScreen extends AbstractAddButton {
  static state = {...AbstractAddButton.state, activeModal: undefined}

  handleChangeText = link => this.setState({ link: link.trim() })

  handleDeleteButton = () => this.setState({ activeModal: 'confirmDeleteButton' })

  handleDeleteConfirm = () => {
    this.setState({ link: '', type: '', hasDeletedButton: true })
    this.props.updateWorkingDraft({actionButton: { type: '', link: '' }})
    this.closeModal()
  }

  closeModal = () => this.setState({ activeModal: undefined })

  onLeft = () => NavActions.pop()

  onRight = () => {
    const { type, link } = this.state
    this.handleSubmit(type, link)
    NavActions.pop()
  }

  renderConfirmDeleteButton() {
    const title = 'Delete Button'
    const message = 'Are you sure you want to delete your button?'
    return (
      <Modal closeModal={this.closeModal} modalStyle={modalWrapperStyles}>
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

  render() {
    const {
      link,
      type,
      hasAttemptedSubmit,
      hasDeletedButton,
      activeModal,
    } = this.state
    return (
      <View style={styles.root}>
        <NavBar
          title="ADD A BUTTON"
          onLeft={this.onLeft}
          leftTitle="Cancel"
          onRight={this.onRight}
          isRightValid={this.isValid(link) || (hasDeletedButton && link === '')}
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
                checked={type === 'info'}
                onPress={this.setMoreInfoType}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <Text style={styles.buttonText}>Book now button</Text>
              <Checkbox
                checked={type === 'booking'}
                onPress={this.setBookNowType}
              />
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <Text style={styles.buttonText}>Sign up button</Text>
              <Checkbox
                checked={type === 'signup'}
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
            value={link}
          />
          {!!link && hasAttemptedSubmit && !this.isValidUrl(link) && (
            <View style={styles.errorRow}>
              <Text style={styles.errorText}>
                Please make sure your Url is valid
              </Text>
            </View>
          )}
          {!!this.props.currentLink
            && this.props.currentLink === link
            && !hasDeletedButton && (
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={this.handleDeleteButton}
              >
                <Text style={styles.deleteText}>Delete button</Text>
              </TouchableOpacity>
            )}
        </View>
        {activeModal === 'confirmDeleteButton' && this.renderConfirmDeleteButton()}
      </View>
    )
  }
}
