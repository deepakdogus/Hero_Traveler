import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightTitle, StyledInput, RightModalCloseX} from './Shared'
import CenteredButtons from '../CenteredButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'

const Container = styled.div``

const InputContainer = styled.div`
  padding: 60px 50px 40px 50px;
`

const CreateBoardStyledInput = styled(StyledInput)`
  font-family: ${props => props.theme.Fonts.type.base};
  font-size: 18px;
  padding-bottom: 15px;
  padding-left: 0px;
  outline: none;
`

export default class CreateBoard extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  renderButtonLeft = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Cancel'}
          margin='none'
          width='138px'
          padding='even'
          type='blackWhite'
        />
      </VerticalCenter>
    )
  }

  renderButtonRight = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Create'}
          margin='none'
          padding='even'
          width='138px'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <RightTitle>CREATE BOARD</RightTitle>
        <InputContainer>
          <CreateBoardStyledInput placeholder='Enter a title for your collection'/>
        </InputContainer>
        <CenteredButtons
          buttonsToRender={[
            this.renderButtonLeft,
            this.renderButtonRight,
          ]}
        />
      </Container>
    )
  }
}
