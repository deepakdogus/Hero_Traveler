import React from 'react'
import styled from 'styled-components'

import FAQContent from '../FAQContent'
import HorizontalDivider from '../HorizontalDivider'

const Container = styled.div`
  padding: 0px 15px;
`

export default class FAQ extends React.Component {

  render() {
    return (
      <Container>
        <HorizontalDivider color='light-grey'/>
        <FAQContent/>
      </Container>
    )
  }
}
