import React, { Component } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightModalCloseX} from './Shared'
import TabBar from '../TabBar'

import FAQ from './FAQ'
import TermsAndConditions from './TermsAndConditions'
import Privacy from './Privacy'
import UXActions from '../../Redux/UXRedux'

const Container = styled.div``

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

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.handleClose}/>
        <TabBar
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
          tabs={tabBarTabs}
          isModal
          whiteBG
        />
        {this.state.activeTab === 'FAQ' && <FAQ/>}
        {this.state.activeTab === 'Terms & Conditions' && <TermsAndConditions/>}
        {this.state.activeTab === 'Privacy Policy' && <Privacy />}
      </Container>
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

export default connect(mapStateToProps, mapDispatchToPRops)(Documentation)
