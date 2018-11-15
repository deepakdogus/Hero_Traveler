import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import TabBar from '../TabBar'

import FAQ from './FAQ'
import TermsAndConditions from './TermsAndConditions'
import Privacy from './Privacy'
import UXActions from '../../Redux/UXRedux'

import {
  Container,
  RightModalCloseX,
  ExteriorCloseXContainer,
  modalPadding,
} from './Shared'
import HorizontalDivider from '../HorizontalDivider'
import Icon from '../Icon'

import onClickOutside from 'react-onclickoutside'

const StyledContainer = styled(Container)`
  padding: ${modalPadding}rem calc(${modalPadding}rem + 10px);
  max-height: calc(100% - ${modalPadding * 2}rem);
  display: flex;
  flex-direction: column;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 20px;
  }
`

const StyledDivider = styled(HorizontalDivider)`
  margin: 0;
`

const ResponsiveCloseX = styled(RightModalCloseX)`
  display: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    display: block;
  }
`

export const tabbarObj = {
  FAQ: 'FAQ',
  Terms: 'Terms & Conditions',
  Privacy: 'Privacy Policy',
}

const tabBarTabs = Object.values(tabbarObj)

class Documentation extends Component {
  static propTypes = {
    openGlobalModal: PropTypes.func,
    closeGlobalModal: PropTypes.func,
    globalModalParams: PropTypes.object,
  }

  defaultProps = {
    globalModalParams: {},
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: props.globalModalParams.activeTab || 'FAQ',
    }
  }

  onClickTab = (event) => {
    let tab = event.target.innerHTML.split('&amp;').join('&')
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab })
  }

  handleClose = () => {
    const onCloseModal = this.props.globalModalParams.onCloseModal
    if (onCloseModal) this.props.openGlobalModal(onCloseModal)
    else this.props.closeGlobalModal()
  }

  handleClickOutside = (e) => {
    e.preventDefault()
    this.handleClose()
  }

  render() {
    return (
      <StyledContainer>
        <ResponsiveCloseX
          name='closeDark'
          onClick={this.handleClose}
        />
        <ExteriorCloseXContainer>
          <Icon
            name='closeWhite'
            onClick={this.handleClickOutside}
          />
        </ExteriorCloseXContainer>
        <TabBar
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
          tabs={tabBarTabs}
          isModal
          whiteBG
        />
        <StyledDivider color='light-grey'/>
        {this.state.activeTab === 'FAQ' && <FAQ/>}
        {this.state.activeTab === 'Terms & Conditions' && <TermsAndConditions/>}
        {this.state.activeTab === 'Privacy Policy' && <Privacy />}
      </StyledContainer>
    )
  }
}

const mapStateToProps = (state) => ({ globalModalParams: state.ux.params})

const mapDispatchToPRops = (dispatch) => {
  return {
    closeGlobalModal: () => dispatch(UXActions.closeGlobalModal()),
    openGlobalModal: (modalName) => dispatch(UXActions.openGlobalModal(modalName)),
  }
}

export default connect(mapStateToProps, mapDispatchToPRops)(onClickOutside(Documentation))
