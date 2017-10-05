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
  text-align:center;
  padding: 40px 0px;
`

export default class CenteredLeftRightButtons extends Component {
  static propTypes = {
    renderButtonLeft: PropTypes.func,
    renderButtonRight: PropTypes.func,
  }

  render() {
    const {renderButtonLeft, renderButtonRight} = this.props
    return (
      <Centered>
        <StyledRow >
          <ButtonContainer>
            {renderButtonLeft()}            
          </ButtonContainer>
          <ButtonContainer>
            {renderButtonRight()}
          </ButtonContainer>
        </StyledRow>        
      </Centered>    
    )
  }
}
