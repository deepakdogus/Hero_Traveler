import _ from 'lodash'
import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {MenuLink} from './Headers/Shared'
import { haveFieldsChanged } from '../Shared/Lib/draftChangedHelpers'

const Container = styled.div`
  margin: 0;
  padding: 0;
`

const ShouldEditLink = styled.p`
  margin: 0px;
  text-decoration: none;
  padding: 10px;
  margin-right: 10px;
  display: flex;
  color: white;
  font-family: 'montserrat';
  font-size: 15px;
  letter-spacing: .6px;
  border-bottom-width: 3px;
  border-bottom-color: transparent;
  border-bottom-style: solid;
`

const ShouldEditLogo = styled.div`
  color: white;
  font-family: 'montserrat';
  font-size: 15px;
  letter-spacing: .6px;
  ${props => {
    props.noBorder ? 'null' :
   `border-bottom-width: 3px;
    border-bottom-color: transparent;
    border-bottom-style: solid;`
  }}
`

export default class ConditionalLink extends React.Component{
  static propTypes = {
    to: PropTypes.string,
    pathname: PropTypes.string,
    onClick: PropTypes.func,
    openSaveEditsModal: PropTypes.func,
    isMenuLink: PropTypes.bool,
    reroute: PropTypes.func,
    workingDraft: PropTypes.object,
    originalDraft: PropTypes.object,
    children: PropTypes.any,
    noBorder: PropTypes.bool,
    pendingMediaUploads: PropTypes.number,
  }

  _handleOpenSaveEditsModal = () => {
    const {
      openSaveEditsModal,
      originalDraft,
      pendingMediaUploads,
      reroute,
      to,
      workingDraft,
    } = this.props
    if (haveFieldsChanged(workingDraft, originalDraft) || pendingMediaUploads) {
      return openSaveEditsModal(to)
    }
    return reroute(to)
  }

  getShouldOpenSaveEditsModal = () => {
    const {pathname} = this.props
    return pathname.includes('editStory')
  }

  _renderOpenSaveEditsLinkContainer = () => {
    const ChildrenWrapper = this.props.isMenuLink
    ? ShouldEditLink
    : ShouldEditLogo
    return (
      <Container onClick={this._handleOpenSaveEditsModal}>
        <ChildrenWrapper>
          {this.props.children}
        </ChildrenWrapper>
      </Container>
    )
  }

  getLink = () => {
    const {
      isMenuLink,
      to,
    } = this.props

    if (this.getShouldOpenSaveEditsModal()) {
      return this._renderOpenSaveEditsLinkContainer()
    }
    else {
      const ChosenLink = isMenuLink ? MenuLink : Link
      const props = {to}
      if (isMenuLink) props.exact = true
      return (
        <ChosenLink {...props}>
          {this.props.children}
        </ChosenLink>
      )
    }
  }

  render(){
    return(
      <Container>
        {this.getLink()}
      </Container>
    )
  }
}
