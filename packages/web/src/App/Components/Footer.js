import React from 'react'
import styled from 'styled-components'

import Icon from './Icon'
import {NavLink} from 'react-router-dom';

const Container = styled.div`
  width: 100%;
`

const SizedDiv = styled.div`
  position: relative;
  margin: 0 auto 20px;
  padding-top: 10px;
  border-top: ${props => `2px solid ${props.theme.Colors.background}`};
`

const StyledLink = styled(NavLink)`
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-decoration: none;
  margin-right: 25px;
`

const Right = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`

const Divider = styled.div`
  display: inline-block;
  width: 2px;
  background-color: ${props => props.theme.Colors.background};
  height: 35px;
  margin: 0 10px;
`

const StyledIcon = styled(Icon)`
  height: 25px;
  margin-top: 10px;
`

const FacebookIcon = styled(StyledIcon)`
  width: 12.5px;
  padding: 0 9px;
`

const TwitterIcon = styled(StyledIcon)`
  width: 30.5px;
`

const InstagramIcon = styled(StyledIcon)`
  width: 25px;
  padding: 0 2.5px;
`

/*
Need black icons and what size they want them. Ideally all icons should be square!
*/
export default class Footer extends React.Component {

  render () {
    return (
      <Container fluid>
        <SizedDiv>
          <StyledLink to='/'>About Us</StyledLink>
          <StyledLink to='/'>Terms of Service</StyledLink>
          <StyledLink to='/'>Contact Us</StyledLink>
          <Right>
            <FacebookIcon name='facebook-blue'/>
            <Divider></Divider>
            <TwitterIcon name='twitter-blue'/>
            <Divider></Divider>
            <InstagramIcon name='instagram'/>
          </Right>
        </SizedDiv>
      </Container>
    )
  }
}
