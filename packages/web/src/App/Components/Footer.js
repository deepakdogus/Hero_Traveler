import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

import Icon from './Icon'
import { Row } from './FlexboxGrid'

import UXActions from '../Redux/UXRedux'

const LinkStyles = `
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .6px;
  text-decoration: none;
  margin-right: 25px;
  margin-bottom: 0;
`

const Container = styled.div`
  width: 100%;
  margin: 80px 0 25px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 40px 0 25px;
  }
`

const SizedRow = styled(Row)`
  position: relative;
  margin: 0 auto 20px;
  padding-right: 16px;
  height: 35px;
  border-top: ${props => `2px solid ${props.theme.Colors.background}`};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    flex-wrap: nowrap;
    padding: 0 10px;
  }
`

const LinkRow = styled(Row)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    align-items: center;
  }
`

const StyledLink = styled(NavLink)`
${LinkStyles}
  font-family: ${props => props.theme.Fonts.type.montserrat};
  letter-spacing: .6px;
  color: ${props => props.theme.Colors.background};
  &:visited {
    color: ${props => props.theme.Colors.background};
  }

`

const StyledOffsiteLink = styled.a`
  ${LinkStyles}
  font-family: ${props => props.theme.Fonts.type.montserrat};
  letter-spacing: .6px;
  color: ${props => props.theme.Colors.background};
  &:visited {
    color: ${props => props.theme.Colors.background};
  }
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 10px;
  }
`

const StyledPseudoLink = styled.div`
  ${LinkStyles}
  font-family: ${props => props.theme.Fonts.type.montserrat};
  letter-spacing: .6px;
  color: ${props => props.theme.Colors.background};
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 10px;
  }
`

const UnstyledLink = styled.a`
  margin-top: 6px;
`

const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.background};
  height: 35px;
  margin: 0 16px;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: 0 10px;
  }
`

const StyledIcon = styled(Icon)`
  width: 20px;
  height: 20px;
  align-self: center;
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    width: 15px;
    height: 15px;
  }
`

const ResponsiveContainer = styled.div`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: ${props => props.hideOnTablet ? 'none' : 'block'};
  }
`

class Footer extends Component {
  static propTypes = {
    openGlobalModal: PropTypes.func,
    hideOnTablet: PropTypes.bool,
  }

  openTAC = () => {
    this.props.openGlobalModal(
      'documentation',
      { activeTab: 'Terms & Conditions' },
    )
  }

  render() {
    return (
      <Container fluid>
        <ResponsiveContainer hideOnTablet={this.props.hideOnTablet}>
          <SizedRow between='xs'>
            <LinkRow bottom='xs'>
              {/* Hidden until after launch*/}
              {false && (
                <StyledLink to='/'>About Us</StyledLink>
              )}
              <StyledPseudoLink
                onClick={this.openTAC}
              >
                Terms of Service
              </StyledPseudoLink>
              <StyledOffsiteLink
                href='mailto:info@herotraveler.com'
              >
                Contact Us
              </StyledOffsiteLink>
            </LinkRow>
            <Row middle='xs'>
              <UnstyledLink
                href='https://www.facebook.com/herotraveler/'
                target='_blank'
                rel="noopener noreferrer"
              >
                <StyledIcon name='facebookDark'/>
              </UnstyledLink>
              <Divider />
              <UnstyledLink
                href='https://twitter.com/HeroTraveler'
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon name='twitterDark'/>
              </UnstyledLink>
              <Divider />
              <UnstyledLink
                href='https://www.instagram.com/herotraveler/'
                target="_blank"
                rel="noopener noreferrer"
              >
                <StyledIcon name='instagramDark'/>
              </UnstyledLink>
            </Row>
          </SizedRow>
        </ResponsiveContainer>
      </Container>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Footer)
