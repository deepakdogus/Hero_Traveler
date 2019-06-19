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
import Icon from '../../Shared/Web/Components/Icon'

import onClickOutside from 'react-onclickoutside'

const StyledContainer = styled(Container)`
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

/* additional breakpoint width is necessary to counteract the default auto
 * margin of react-modal when using full-width modals with exterior elements
 */
const EXTRA_WIDTH = 70

const ResponsiveCloseX = styled(RightModalCloseX)`
  display: none;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet + EXTRA_WIDTH}px) {
    display: block;
  }
`

const ExtraWidthExteriorCloseX = styled(ExteriorCloseXContainer)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet + EXTRA_WIDTH}px) {
    display: none;
  }
`

export const tabbarObj = {
  FAQ: 'FAQ',
  Terms: 'Terms & Conditions',
  Privacy: 'Privacy Policy',
}

// Object.values(tabbarObj) is not supported by firefox
const tabBarTabs = Object.keys(tabbarObj).map(key => tabbarObj[key])

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
        <ExtraWidthExteriorCloseX>
          <Icon
            name='closeWhite'
            onClick={this.handleClickOutside}
          />
        </ExtraWidthExteriorCloseX>
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
