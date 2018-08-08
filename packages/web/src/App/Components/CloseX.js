import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from './Icon'
import RoundedButton from './RoundedButton'

const Container = styled.div``

const StyledIcon = styled(Icon)`
  align-self: center;
  cursor: pointer;
`

export default class CloseX extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
  }

  render() {
    return (
      <Container>
        <RoundedButton
          type='backgroundOpaque'
          padding='even'
          margin='small'
          height='30px'
          width='30px'
          onClick={this.props.onClick}
        >
          <StyledIcon size='small' name='close'/>
        </RoundedButton>
      </Container>
      )
  }
}
