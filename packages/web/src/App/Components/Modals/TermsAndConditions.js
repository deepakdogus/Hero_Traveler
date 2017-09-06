import React from 'react'
import styled from 'styled-components'

import TermsAndConditionsScreen from '../TermsAndConditionsScreen'
import HorizontalDivider from '../HorizontalDivider'

const Container = styled.div`
  padding: 0px 15px;
`

export default class TermsAndConditions extends React.Component {
  render() {
    return (
      <Container>
        <HorizontalDivider color='light-grey'/>
        <TermsAndConditionsScreen/>
      </Container>
    )
  }
}
