import React from 'react'
import PropTypes from 'prop-types'

import RoundedButton from '../../RoundedButton'
import {
  Container,
  Title,
  Text,
} from '../Shared'
import {Row} from '../../FlexboxGrid'



export default class SaveEdits extends React.Component{

  static proptypes = {
    reroute: PropTypes.func,
    nextPathAfterSave: PropTypes.string,
    closeModal: PropTypes.func,
    attemptLogout: PropTypes.func,
    resetCreateStore: PropTypes.func,
    params: PropTypes.object,
  }

  saveAndReroute = () => {
    this.props.params.updateDraft()
    if (this.props.nextPathAfterSave === 'logout') {
      this.logoutAndReroute()
    } else {
      this.props.reroute(this.props.nextPathAfterSave)
    }
    this.props.closeModal()
  }

  dontSaveAndReroute = () => {
    if (this.props.nextPathAfterSave === 'logout') {
      this.logoutAndReroute()
    } else {
      this.props.reroute(this.props.nextPathAfterSave)
    }
    this.props.resetCreateStore()
    this.props.closeModal()
  }

  logoutAndReroute = () => {
    this.props.attemptLogout()
    this.props.reroute('/')
  }

  _renderModalMessage = () => {
    return this.props.nextPathAfterSave === 'logout'
    ? 'Do you want to save your changes before you go?'
    : 'Do you want to save your changes before you leave this page?'
  }

  render(){

    return(
      <Container>
        <Title>{ this._renderModalMessage() }</Title>
        <Text>Any changes that are not saved will be lost</Text>
        <Row center='xs'>
          <RoundedButton
            text='No'
            margin='small'
            type='blackWhite'
            onClick={this.dontSaveAndReroute}
          />
          <RoundedButton
            text='Yes'
            margin='small'
            onClick={this.saveAndReroute}
          />
        </Row>
      </Container>
    )
  }
}