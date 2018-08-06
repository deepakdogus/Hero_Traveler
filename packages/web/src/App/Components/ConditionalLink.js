import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuLink} from './Headers/Shared'

const Container = styled.div``

const ShouldEditLink = styled.p`
  text-decoration: none;
  padding: 10px;
  margin-right: 10px;
  display: flex;
  color: white;
  font-family: 'montserrat';
  font-size: 15px;
  letter-spacing: 1.2px;
  border-bottom-width: 3px;
  border-bottom-color: transparent;
  border-bottom-style: solid;
`


export default class ConditionalLink extends React.Component{

  static proptypes = {
    to: PropTypes.string,
    pathname: PropTypes.string,
    onClick: PropTypes.func,
    openSaveEditsModal: PropTypes.func,
    isMenuLink: PropTypes.bool
  }

  _handleOpenSaveEditsModal = () => {
    this.props.openSaveEditsModal(this.props.to)
  }

  render(){
    const {to, pathname, isMenuLink} = this.props
    //if conditional Link is a MenuLink
    const menulinkOrSaveEdit = pathname.includes('editStory') && isMenuLink ?
      <Container onClick={this._handleOpenSaveEditsModal} style={{cursor: 'pointer'}}>
        <ShouldEditLink>
          {this.props.children}
        </ShouldEditLink>
      </Container> :
      <MenuLink to={to} exact>
        {this.props.children}
      </MenuLink>
    //if Conditional Link is the Logo
    const logoOrSaveEdit = pathname.includes('editStory') && !isMenuLink ?
      <Container onClick={this._handleOpenSaveEditsModal} style={{cursor: 'pointer'}}>
          {this.props.children}
      </Container> :
      <Link to={to}>
        {this.props.children}
      </Link>
    //what is the final appropriate link to render
    const link = isMenuLink ? menulinkOrSaveEdit : logoOrSaveEdit

      return(
        <Container>
          {link}
        </Container>
      )
  }
}