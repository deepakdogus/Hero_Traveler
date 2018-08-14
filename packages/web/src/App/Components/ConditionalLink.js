import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuLink} from './Headers/Shared'

const Container = styled.div`
  margin: 0;
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
  getShouldOpenSaveEditsModal = (isMenuLink) => {
    const {pathname, draftHasChanged} = this.props
    return pathname.includes('editStory')
    && isMenuLink
    && (pathname.includes('editStory')
    && draftHasChanged())
  }

  _renderOpenSaveEditsMenuLinkContainer = () => {
    const ChildrenWrapper = this.props.isMenuLink ? ShouldEditLink : ShouldEditLogo
    return (
      <Container onClick={this._handleOpenSaveEditsModal} style={{cursor: 'pointer'}}>
        <ChildrenWrapper>
          {this.props.children}
        </ChildrenWrapper>
      </Container>
    )
  }

  getLink() {
    const {isMenuLink} = this.props
    if (this.getShouldOpenSaveEditsModal(isMenuLink)) {
      return this._renderOpenSaveEditsMenuLinkContainer()
    }
    const ChosenLink = this.props.isMenuLink ? MenuLink : Link
    return (
      <ChosenLink to={to}>
        {this.props.children}
      </ChosenLink>
    )
  }

  render(){
    return(
      <Container>
        {this.getLink()}
      </Container>
    )
  }
}
