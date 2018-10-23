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
  letter-spacing: 1.2px;
  text-decoration: none;
  margin-right: 25px;
  margin-bottom: 0;
`

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
${LinkStyles}
  font-family: ${props => props.theme.Fonts.type.montserrat};
  color: ${props => props.theme.Colors.background};
  &:visited {
    color: ${props => props.theme.Colors.background};
  }
`

const StyledOffsiteLink = styled.a`
  ${LinkStyles}
  font-family: ${props => props.theme.Fonts.type.montserrat};
  color: ${props => props.theme.Colors.background};
  &:visited {
    color: ${props => props.theme.Colors.background};
  }
`

const StyledPseudoLink = styled.div`
  ${LinkStyles}
  font-family: ${props => props.theme.Fonts.type.montserrat};
  color: ${props => props.theme.Colors.background};
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

class Footer extends Component {
  static propTypes = {
    openGlobalModal: PropTypes.func,
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
        <SizedRow between='xs'>
          <Row bottom='xs'>
            <StyledLink to='/'>About Us</StyledLink>
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

const mapDispatchToProps = (dispatch) => {
  return {
    openGlobalModal: (modalName, params) => dispatch(UXActions.openGlobalModal(modalName, params)),
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(Footer)
