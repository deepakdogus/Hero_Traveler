import React from 'react'
import PropTypes from 'prop-types'

import RoundedButton from '../RoundedButton'
import {
  Container,
  Title,
  Text,
} from './Shared'
import {Row} from '../FlexboxGrid'

export default class DeleteStory extends React.Component {

  static propTypes = {
    reroute: PropTypes.func,
    closeModal: PropTypes.func,
    deleteStory: PropTypes.func,
    resetCreateStore: PropTypes.func,
    userId: PropTypes.string,
    pathname: PropTypes.string,
  }

  deleteAndReroute = () => {
    const { pathname, reroute, closeModal, resetCreateStore } = this.props
    if (pathname.includes('local')) {
      resetCreateStore()
    } else{
      this._deleteStory()
    }
    reroute('/')
    closeModal()
  }

  _deleteStory = () => {
    const pathArr = this.props.pathname.split('/')
    this.props.deleteStory(this.props.userId, pathArr[pathArr.length - 2])
  }

  render() {

    return (
      <Container>
        <Title>Delete Story:</Title>
        <Text>Are you sure you want to delete this story?</Text>
        <Row center="xs">
        <RoundedButton
            text='No'
            margin='small'
            type='blackWhite'
            onClick={this.props.closeModal}
          />
          <RoundedButton
            text='Yes'
            margin='small'
            onClick={this.deleteAndReroute}
          />
        </Row>
      </Container>
    )
  }
}