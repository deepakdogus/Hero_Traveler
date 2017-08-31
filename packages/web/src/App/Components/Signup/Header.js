import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

// Likely refactor this out into its own component later with &nbsp; included
const Container = styled.div`
  height: 60px;
`

const Right = styled.div`
  float: right;
`

export default class SignupHeader extends React.Component {
  static propTypes = {
    isLoggedIn: PropTypes.bool,
  }

  render () {
    const {children} = this.props
    return (
      <Container>
        <Right>
          {children}
        </Right>
      </Container>
    )
  }
}
