import React from 'react'
import styled from 'styled-components'

import logo from '../../Shared/Images/ht-icons/icon_contributor-popup-logo@2x.png'
import contributorSrc from '../../Shared/Images/ht-icons/icon_contibutor-popup-badge@2x.png'
import {
  Title,
  Text
} from './Shared'

const Container = styled.div`
  background-color: ${props => props.theme.Colors.lightGreyAreas};
  padding: 20px;
`

const RestyledTitle = styled(Title)`
  letter-spacing: 2.5px;
  margin-top: 10px;
`

const Description = styled(Text)`
  font-size: 19px;
`

const Italic = styled.em`
  color: ${props => props.theme.Colors.redHighlights}
`

const StyledImage = styled.img`
  display: block;
  margin: auto;
`

const Logo = styled(StyledImage)`
  width: 149px;
  height: 30px;
  margin-top: 50px;
`

const Badge = styled(StyledImage)`
  width: 120px;
  height: 120px;
  margin: 40px auto;
`

export default class Login extends React.Component {

  render() {
    return (
      <Container>
        <Logo src={logo} alt={'Here Traveler Logo'}/>
        <RestyledTitle>CONTRIBUTOR</RestyledTitle>
        <Badge src={contributorSrc} alt={'Contributor Badge'} align='middle'/>
        <Description>Become eligible to be a Hero Traveler Contributor when you publish <Italic>200 stories</Italic> or more</Description>
      </Container>
    )
  }
}
