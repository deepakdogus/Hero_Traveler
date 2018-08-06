import React from 'react'
import PropTypes from 'prop-types'

import RoundedButton from '../../RoundedButton'
import { Container,Title, } from '../../Modals/Shared'
import {Row} from '../../FlexboxGrid'



export default class SaveEdits extends React.Component{

  static proptypes = {
    reroute: PropTypes.func,
    nextPathAfterSave: PropTypes.string,
    closeModal: PropTypes.func,
  }

  // TODO: save draft and then re-reoute
  // saveAndReroute = () => {
  //   this.props.reroute(this.props.nextPathAfterSave)
  // }

  dontSaveAndReroute = () => {
    this.props.reroute(this.props.nextPathAfterSave)
    this.props.closeModal()
  }

  render(){

    return(
      <Container>
        <Title>Do You Want To Save Before Leaving Story Edit?</Title>
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
          />
        </Row>
      </Container>
    )
  }
}