import React from 'react'
import styled from 'styled-components'

import HorizontalDivider from '../HorizontalDivider'
import SocialMediaRow from '../Signup/SocialMediaRow'

const Container = styled.div`
  padding: 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0px;
  }
`

const StyledSocialMediaRow = styled(SocialMediaRow)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 25px;
  }
`

export default class EditServices extends React.Component {
  render() {
    return (
        <Container>
          <HorizontalDivider color='grey'/>
          <StyledSocialMediaRow text={'Facebook'} margin='modal' isConnected={true} />
          <HorizontalDivider color='grey'/>
          <StyledSocialMediaRow text={'Twitter'} margin='modal' isConnected={false} />
          <HorizontalDivider color='grey'/>
          <StyledSocialMediaRow text={'Instagram'} margin='modal' isConnected={false} />
          <HorizontalDivider color='grey'/>
        </Container>
    )
  }
}
