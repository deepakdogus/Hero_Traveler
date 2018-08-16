import React from 'react'
import PropTypes from 'prop-types'

import RoundedButton from '../RoundedButton'
import {
  Container,
  Title,
  Text,
} from './Shared'
import {Row} from '../FlexboxGrid'

export default class FlagStory extends React.Component {
  static proptypes = {
    closeModal: PropTypes.func,
    reroute: PropTypes.func,
    flagStory: PropTypes.func,
    userId: PropTypes.string,
    params: PropTypes.object,
  }

  _flagAndReroute = () => {
    this.props.flagStory(this.props.userId, this.props.params.storyId)
    this.props.reroute('/feed')
    this.props.closeModal()
  }


  _dontFlagAndReroute = () => {
    this.props.closeModal()
  }

  render(){

    return(
      <Container>
        <Title>Flag Story:</Title>
        <Text>Are you sure you want to flag this story?</Text>
        <Row center='xs'>
          <RoundedButton
            text='No'
            margin='small'
            type='blackWhite'
            onClick={this._dontFlagAndReroute}/>
          <RoundedButton
            text='Yes'
            margin='small'
            type=''
            onClick={this._flagAndReroute}
          />
        </Row>
      </Container>
    )
  }
}