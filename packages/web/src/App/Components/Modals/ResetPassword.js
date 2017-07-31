import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import RoundedButton from '../RoundedButton'
import {
  Container,
  Title,
  StyledInput,
} from './Shared'

const RestyledInput = styled(StyledInput)`
  margin: 120px 0 50px;
`

export default class ResetPassword extends React.Component {
  static PropTypes = {
    onLoginClick: PropTypes.func,
  }

  render() {
    return (
      <Container>
        <Title>RESET PASSWORD</Title>
        <RestyledInput placeholder='Email'/>
        <RoundedButton
          text='SUBMIT'
          width='100%'
          margin='none'
          height='39px'
        />
      </Container>
    )
  }
}
