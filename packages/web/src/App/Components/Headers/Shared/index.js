import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { Row } from '../../FlexboxGrid'
import Icon from '../../Icon'
import RoundedButton from '../../RoundedButton'
import { mediaMax } from '../../ContentLayout.component'
import ConditionalLink from '../../ConditionalLink'

export const StyledRow = styled(Row)`
  height: 65px;
`

export const StyledRoundedButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 10px;
`

export const SearchIcon = styled(Icon)`
  height: 17px;
  width: 17px;
`

export const LoginLink = styled.a`
  font-family: 'montserrat';
  color: #ffffff;
  letter-spacing: 1.5px;
  font-size: 13px;
  display: none;
  ${mediaMax.phone`display: inline;`}
`

export const Logo = styled.img`
  height: 30px;
  margin-top: 6px;
  margin-left: 20px;
`

export const Divider = styled.div`
  display: inline-block;
  width: 1px;
  background-color: ${props => props.theme.Colors.snow};
  margin-left: 10px;
  margin-right: 10px;
`

export const StyledRoundedLoginButton = styled(RoundedButton)`
  margin-left: 10px;
  margin-right: 20px;
  display: inline;
  ${mediaMax.phone`display: none;`}
`

export const HamburgerIcon = styled(Icon)`
  height: 30px;
  width: 30px;
  margin: 8px;
  display: none;
  ${mediaMax.desktop`display: inline;`}
`

export const MenuLink = (props) => {
  return (
    <NavLink
      exact={props.exact}
      style={{
        textDecoration: 'none',
        padding: 10,
        marginRight: 10,
        display: 'flex',
        color: 'white',
        fontFamily: 'montserrat',
        fontSize: '15px',
        letterSpacing: '1.2px',
        borderBottomWidth: '3px',
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid'
      }}
      activeStyle={{
        borderBottomWidth: '3px',
        borderBottomColor: 'red'
      }}
      to={props.to}>
        {props.children}
      </NavLink>
  )
}

export const SearchNav = (props) => {
  const {
    pathname,
    openSaveEditsModal,
    haveFieldsChanged,
    workingDraft,
    originalDraft,
  } = props

  return (
    <ConditionalLink
      to='/search'
      pathname={pathname}
      openSaveEditsModal={openSaveEditsModal}
      isMenuLink={false}
      haveFieldsChanged={haveFieldsChanged}
      workingDraft={workingDraft}
      originalDraft={originalDraft}
      noBorder={true}
    >
      <StyledRoundedButton
        type='headerButton'
        height='32px'
        width='32px'
      >
      <SearchIcon
        name='explore'
      />
      </StyledRoundedButton>
    </ConditionalLink>
  )
}

MenuLink.propTypes = {
  to: PropTypes.string,
  exact: PropTypes.bool,
  children: PropTypes.string,
}

SearchNav.propTypes = {
  pathname: PropTypes.string,
  openSaveEditsModal: PropTypes.func,
  haveFieldsChanged: PropTypes.func,
  workingDraft: PropTypes.object,
  originalDraft: PropTypes.object,
}
