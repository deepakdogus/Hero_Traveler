import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-left: 25px;
  }
`

const StyledInputLabel = styled.label`
  font-family: ${props => props.theme.Fonts.type.base};
  display: block;
  font-size: 14px;
  font-weight: 400;
  letter-spacing: .2px;
  color:  ${props => props.fontColor === 'background' ? props.theme.Colors.background : props.theme.Colors.navBarText};
  padding: 8px 0;
`

export const StyledInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  border: none;
  color: ${props => props.theme.Colors.background};
  font-size: 18px;
  font-weight: 600;
  letter-spacing: .2px;
  outline: none;
  padding-bottom: 8px;
  padding-left: 0px;
  width: 100%;
`

export default class InputWithLabel extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    name: PropTypes.string,
    type: PropTypes.string,
    id: PropTypes.string,
    fontColor: PropTypes.string,
  }

  render() {
    const {
      name,
      type,
      id,
      label,
      placeholder,
      onChange,
      value,
      fontColor,
    } = this.props

    return (
      <Container>
        <StyledInputLabel
          fontColor={fontColor}
          for={name}>
          {label}
        </StyledInputLabel>
        <StyledInput
          id={id}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
        />
      </Container>
    )
  }
}
