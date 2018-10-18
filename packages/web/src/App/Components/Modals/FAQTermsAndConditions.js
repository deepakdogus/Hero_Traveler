import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightModalCloseX} from './Shared'
import TabBar from '../TabBar'

import FAQ from './FAQ'
import TermsAndConditions from './TermsAndConditions'

const Container = styled.div``

const tabBarTabs = ['FAQ', 'Terms & Conditions']

class FAQTermsAndConditions extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    globalModalParams: PropTypes.object,
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

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <TabBar
          activeTab={this.state.activeTab}
          onClickTab={this.onClickTab}
          tabs={tabBarTabs}
          isModal
          whiteBG
        />
        {this.state.activeTab === 'FAQ' && <FAQ/>}
        {this.state.activeTab === 'Terms & Conditions' && <TermsAndConditions/>}
      </Container>
    )
  }
}

const mapStateToProps = (state) => ({ globalModalParams: state.ux.params})

export default connect(mapStateToProps, null)(FAQTermsAndConditions)
