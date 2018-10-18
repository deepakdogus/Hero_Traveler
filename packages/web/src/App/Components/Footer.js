import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import Icon from './Icon'
import { Row } from './FlexboxGrid'

const Container = styled.div`
  width: 100%;
  margin: 80px 0 25px;
`

const SizedRow = styled(Row)`
  position: relative;
  margin: 0 auto 20px;
  padding-right: 16px;
  height: 35px;
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

const StyledOffsiteLink = styled.a`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-decoration: none;
  margin-right: 25px;
  margin-bottom: 0;
`

const StyledPseudoLink = styled.div`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-weight: 400;
  font-size: 16px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-decoration: none;
  margin-right: 25px;
  margin-bottom: 0;
  cursor: pointer;
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
  static propTypes = {
    openGlobalModal: PropTypes.func,
  }

  openTAC = () => {
    this.openGlobalModalandClose('faqTermsAndConditions', 'Terms & Conditions')
  }

  openGlobalModalandClose = (modalName, activeTab) => {
    this.props.openGlobalModal(modalName, { activeTab })
  }

  render() {
    return (
      <Container fluid>
        <SizedRow between='xs'>
          <Row bottom='xs'>
            <StyledLink to='/'>About Us</StyledLink>
            <StyledPseudoLink onClick={this.openTAC}>Terms of Service</StyledPseudoLink>
            <StyledOffsiteLink href='mailto:info@herotraveler.com'>Contact Us</StyledOffsiteLink>
          </Row>
          {/* hidden until HT social media campaigns launch */}
          {false &&
            <Row middle='xs'>
              <StyledIcon name='facebookDark'/>
              <Divider />
              <StyledIcon name='twitterDark'/>
              <Divider />
              <StyledIcon name='instagramDark'/>
            </Row>
          }
        </SizedRow>
      </Container>
    )
  }
}
