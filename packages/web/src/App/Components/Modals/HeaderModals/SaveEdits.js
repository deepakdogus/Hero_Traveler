import React from 'react'
import PropTypes from 'prop-types'

import RoundedButton from '../../../Shared/Web/Components/RoundedButton'
import {
  Container,
  Title,
  Text,
} from '../Shared'
import {Row} from '../../../Shared/Web/Components/FlexboxGrid'

export default class SaveEdits extends React.Component {
  static propTypes = {
    reroute: PropTypes.func,
    nextPathAfterSave: PropTypes.string,
    closeModal: PropTypes.func,
    attemptLogout: PropTypes.func,
    resetCreateStore: PropTypes.func,
    params: PropTypes.object,
    pendingMediaUploads: PropTypes.number,
  }

  constructor(props) {
    super(props)
    this.state = {
      isPending: !!props.params.isPending,
    }
  }

  componentDidUpdate = () => {
    if (this.state.isPending && this.props.pendingMediaUploads === 0) {
      setTimeout(() => this.saveAndReroute(), 200)
    }
  }

  saveAndReroute = () => {
    if (this.props.pendingMediaUploads !== 0) return this.setState({isPending: true})
    this.props.params.updateDraft()
    this._reroute()
  }

  dontSaveAndReroute = () => {
    this._reroute()
    this.props.resetCreateStore()
  }

  _reroute = () => {
    if (this.props.nextPathAfterSave === 'logout') {
      this.logoutAndReroute()
    }
    else {
      this.props.reroute(this.props.nextPathAfterSave)
    }
    this.props.closeModal()
  }

  logoutAndReroute = () => {
    this.props.attemptLogout()
    this.props.reroute('/')
  }

  _renderModalMessage = () => {
    return this.props.nextPathAfterSave === 'logout'
    ? 'Do you want to save your changes before you go?'
    : 'Do you want to save your changes before you leave?'
  }

  renderSaveWarning = () => {
    return (
      <Container>
        <Title>{ this._renderModalMessage() }</Title>
        <Text>Any unsaved changes will be discarded.</Text>
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

  renderPendingSaves = () => {
    return (
      <Container>
        <Title>Saving</Title>
        <Text>Please wait while we process your media uploads</Text>
      </Container>
    )
  }

  render() {
    if (this.state.isPending) return this.renderPendingSaves()
    return this.renderSaveWarning()
  }
}
