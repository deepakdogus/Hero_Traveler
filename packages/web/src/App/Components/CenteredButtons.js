import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {Row} from './FlexboxGrid'
import VerticalCenter from './VerticalCenter'

const StyledRow = styled(Row)`
  justify-content: center;
`

const ButtonContainer = styled.div`
  margin: 0px 5px;
`

const Centered = styled(VerticalCenter)`
  text-align: center;
  padding: 40px 0px;
`

export default class CenteredButtons extends Component {
  static propTypes = {
    buttonsToRender: PropTypes.arrayOf(PropTypes.func),
  }

  renderButtons() {
    return this.props.buttonsToRender.map((renderButton, index) => {
      return (
        <ButtonContainer key={index}>
          {renderButton()}
        </ButtonContainer>
      )
    })
  }

  render() {
    return (
      <Centered>
        <StyledRow>
          {this.renderButtons()}
        </StyledRow>
      </Centered>
    )
  }
}
