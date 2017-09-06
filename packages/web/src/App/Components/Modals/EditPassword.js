import React from 'react'
import styled from 'styled-components'

import InputWithLabel from '../InputWithLabel'
import CenteredLeftRightButtons from '../CenteredLeftRightButtons'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'

const Container = styled.div``

const InputContainer = styled.div`
  padding: 25px;
`

export default class EditPassword extends React.Component {
  renderButtonLeft = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Cancel'}
          margin='none'
          width='116px'
          type='blackWhite'
          padding='mediumEven'
        />
      </VerticalCenter>
    )
  }

  renderButtonRight = () => {
    return (
      <VerticalCenter>
        <RoundedButton
          text={'Save Password'}
          margin='none'
          width='180px'
          padding='mediumEven'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        <InputContainer>
          <InputWithLabel 
            id='oldPassword'
            name='oldPassword'
            placeholder=''
            label='Old Password'
            type='password'
          />          
        </InputContainer>
        <InputContainer>
          <InputWithLabel 
            id='newPassword'
            name='newPassword'
            placeholder=''
            label='New Password'
            type='password'
          />                    
        </InputContainer>
        <InputContainer>
          <InputWithLabel 
            id='retypePassword'
            name='retypePassword'
            placeholder=''
            label='Retype Password'
            type='password'
          />                              
        </InputContainer>
        <CenteredLeftRightButtons
          renderButtonLeft={this.renderButtonLeft}
          renderButtonRight={this.renderButtonRight}
        />
      </Container>
    )
  }
}
