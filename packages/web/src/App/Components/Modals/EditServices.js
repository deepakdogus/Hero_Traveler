import React from 'react'
import styled from 'styled-components'

import HorizontalDivider from '../HorizontalDivider'
import SocialMediaRow from '../Signup/SocialMediaRow'

const Container = styled.div`
  padding: 25px;
`

export default class EditServices extends React.Component {
  render() {
    return (
        <Container>
          <HorizontalDivider color='grey'/>
          <SocialMediaRow text={'Facebook'} margin='modal' isConnected={true} />
          <HorizontalDivider color='grey'/>
          <SocialMediaRow text={'Twitter'} margin='modal' isConnected={false} />
          <HorizontalDivider color='grey'/>
          <SocialMediaRow text={'Instagram'} margin='modal' isConnected={false} />
          <HorizontalDivider color='grey'/>
        </Container>
    )
  }
}
