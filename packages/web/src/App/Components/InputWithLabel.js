import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div``

const StyledInputLabel = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: .7px;
  color: ${props => props.theme.Colors.navBarText};
  margin-bottom: 8px;
`

export const StyledInput = styled.input`
  border-color: ${props => props.theme.Colors.dividerGrey};
  border-width: 0 0 1px;
  color: ${props => props.theme.Colors.background};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .7px;
  outline: none;
  padding-bottom: 8px;
  padding-left: 0px;
  width: 100%;
`

export default class InputWithLabel extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
  }

  render() {
    const {name, type, id, label, placeholder} = this.props
    return (
      <Container>
        <StyledInputLabel for={name}>{label}</StyledInputLabel>
        <StyledInput id={id} type={type} placeholder={placeholder}/>       
      </Container>
    )
  }
}
