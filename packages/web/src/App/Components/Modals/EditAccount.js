import React from 'react'
import styled from 'styled-components'

import InputWithLabel from '../InputWithLabel'
import VerticalCenter from '../VerticalCenter'
import RoundedButton from '../RoundedButton'
import CenteredButtons from '../CenteredButtons'

const Container = styled.div``

const InputContainer = styled.div`
  font-family: ${props => props.theme.Fonts.type.base};
  font-style: none;
  padding: 25px;
`

export default class EditAccount extends React.Component {

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
          text={'Save Changes'}
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
            id='name'
            name='name'
            placeholder='John Doe'
            label='Name'
          />
        </InputContainer>
        <InputContainer>
          <InputWithLabel
            id='email'
            name='email'
            placeholder='jdoe@gmail.com'
            label='Email'
          />
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
