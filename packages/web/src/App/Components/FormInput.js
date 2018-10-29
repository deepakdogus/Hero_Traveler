import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {
  StyledInput,
} from './Modals/Shared'

const InputWrapper = styled.div``
const ErrorText = styled.p`
  margin: 0;
  top: -25px;
  position: relative;
  font-size: 12px;
  padding-left: 2px;
  color: ${props => props.theme.Colors.redHighlights}
`

export default class Input extends React.Component {
  static propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    placeholder: PropTypes.string,
    type: PropTypes.string,
  }

  render(){
    const {input, meta, placeholder, type} = this.props
    return (
      <InputWrapper>
        <StyledInput
          {...input}
          placeholder={placeholder}
          type={type}
        />
        {!meta.pristine && !meta.active && meta.error &&
          <ErrorText>{meta.error}</ErrorText>
        }
      </InputWrapper>
    )
  }
}
