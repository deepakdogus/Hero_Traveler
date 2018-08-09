import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuLink} from './Headers/Shared'

const Container = styled.div`
  maring: 0;
  padding: 0;
`

const ShouldEditLink = styled.p`
  maring: 0px;
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

const ShouldEditLogo = styled.div`
  padding: 0px;
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
    isMenuLink: PropTypes.bool,
    draftHasChanged: PropTypes.func,
    workingDraft: PropTypes.object,
  }

  _handleOpenSaveEditsModal = () => {
    this.props.openSaveEditsModal(this.props.to)
  }

  //helper function to clean up logic regarding rendering appropriate link, logo, or openSaveEdits link
  linkOrOpenSaveEdits = (navLinkType, isLogo) => {
    const {pathname, draftHasChanged} = this.props
    if (isLogo) navLinkType = !navLinkType
    return pathname.includes('editStory') && navLinkType && (pathname.includes('editStory') && draftHasChanged())
  }

  _renderOpenSaveEditsMenuLinkContainer = () => {
    return (
      <Container onClick={this._handleOpenSaveEditsModal} style={{cursor: 'pointer'}}>
        <ShouldEditLink>
          {this.props.children}
        </ShouldEditLink>
      </Container>
    )
  }

  _renderOpenSaveEditsLogoContainer = () => {
    return (
      <Container onClick={this._handleOpenSaveEditsModal} style={{cursor: 'pointer'}}>
        <ShouldEditLogo>
          {this.props.children}
        </ShouldEditLogo>
      </Container>
    )
  }

  render(){
    const { to } = this.props

    //logic for My Feed and Explore Menu Links
    const menulinkOrSaveEdit = this.linkOrOpenSaveEdits(this.props.isMenuLink)
    ? this._renderOpenSaveEditsMenuLinkContainer()
    : <MenuLink to={to} exact>
        {this.props.children}
      </MenuLink>

    // Logic for Hero traveler Logo Link
    const logoOrSaveEdit = this.linkOrOpenSaveEdits(this.props.isMenuLink, true)
    ? this._renderOpenSaveEditsLogoContainer()
    : <Link to={to}>
        {this.props.children}
      </Link>

    ///Are we rendering Link or Menu Link
    const link = this.props.isMenuLink
    ? menulinkOrSaveEdit
    : logoOrSaveEdit

    return(
      <Container>
        {link}
      </Container>
    )
  }
}