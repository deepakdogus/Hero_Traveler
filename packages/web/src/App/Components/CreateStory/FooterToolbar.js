import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {Row} from '../FlexboxGrid'
import RoundedButton from '../RoundedButton'

const Container = styled.div`
  position: relative;
  margin: 20px;
`

const StyledIcon = styled(Icon)`
  align-self: center;
`

export default class FooterToolbar extends Component {
  static propTypes = {
    isDetailsView: PropTypes.bool,
    discardDraft: PropTypes.func,
    updateDraft: PropTypes.func,
    onRight: PropTypes.func,
    onLeft: PropTypes.func,
  }

  renderIcons = () => {
    const {discardDraft, updateDraft} = this.props
    return (
      <Row middle='xs'>
        <RoundedButton
          type='grey'
          padding='even'
          margin='medium'
          width='50px'
          height='50px'
          onClick={discardDraft}
        >
          <StyledIcon name='trash'/>
        </RoundedButton>
        <RoundedButton
          type='grey'
          padding='even'
          margin='medium'
          width='50px'
          height='50px'
          onClick={updateDraft}
        >
          <StyledIcon name='save'/>
        </RoundedButton>
      </Row>
    )
  }

  renderButtons = () => {
    const {isDetailsView, onRight, onLeft} = this.props
    return (
      <Container>
        <Row middle='xs'>
          <RoundedButton
            text={isDetailsView ? '< Back' : 'Preview'}
            margin='medium'
            padding='even'
            width='120px'
            type='grey'
            onClick={onLeft}
          />
          <RoundedButton
            text={isDetailsView ? 'Publish' : 'Next >'}
            margin='medium'
            padding='even'
            width='120px'
            onClick={onRight}
          />
        </Row>
      </Container>
    )
  }

  render() {
    return (
      <Container>
        <Row between='xs'>
          {this.renderIcons()}
          {this.renderButtons()}
        </Row>
      </Container>
    )
  }
}
