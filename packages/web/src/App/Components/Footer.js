import React from 'react'
import styled from 'styled-components'
import {NavLink} from 'react-router-dom';

import Icon from './Icon'
import {Row} from './FlexboxGrid'

const Container = styled.div`
  width: 100%;
  margin: 25px 0;
`

const SizedRow = styled(Row)`
  position: relative;
  margin: 0 auto 20px;
  padding-right: 16px;
  border-top: ${props => `2px solid ${props.theme.Colors.background}`};
`

const StyledLink = styled(NavLink)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-decoration: none;
  margin-right: 25px;
  margin-bottom: 0;
`

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.background};
  height: 35px;
  margin: 0 16px;
`

const StyledIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  align-self: center;
  margin-top: 6px;
  cursor: pointer;
`

/*
Need black icons and what size they want them. Ideally all icons should be square!
*/
export default class Footer extends React.Component {

  render () {
    return (
      <Container fluid>
        <SizedRow between='xs'>
          <Row bottom='xs'>
            <StyledLink to='/'>About Us</StyledLink>
            <StyledLink to='/'>Terms of Service</StyledLink>
            <StyledLink to='/'>Contact Us</StyledLink>
          </Row>
          <Row middle='xs'>
            <StyledIcon name='facebook-dark'/>
            <Divider></Divider>
            <StyledIcon name='twitter-dark'/>
            <Divider></Divider>
            <StyledIcon name='instagram-dark'/>
          </Row>
        </SizedRow>
      </Container>
    )
  }
}
