import React from 'react'
import styled from 'styled-components'
import { NavLink } from 'react-router-dom'

const NavLinkContainer = styled.div`
  padding: 0;
  margin: 10px 25px; 
  ${props => props.styleOverride}
`

export const NavLinkStyled = styled(NavLink)`
  text-decoration: none;
  color: inherit;
`

export function WrappedNavLink({to, styles=``,  children}){
  return (
    <NavLinkContainer styleOverride={styles}>
      <NavLinkStyled to={to}>
        {children}
      </NavLinkStyled>
    </NavLinkContainer>
  )
}




