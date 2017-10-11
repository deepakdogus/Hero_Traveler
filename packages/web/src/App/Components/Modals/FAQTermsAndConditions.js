import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightModalCloseX} from './Shared'
import ModalTogglebar from '../ModalTogglebar'

import FAQ from './FAQ'
import TermsAndConditions from './TermsAndConditions'

const Container = styled.div``

const toggleBarTabs = ['FAQ', 'Terms & Conditions']

export default class FAQTermsAndConditions extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      activeTab: 'FAQ'
    }
  }

  toggleModal = (event) => {
    let tab = event.target.innerHTML.split("&amp;").join("&")
    if (this.state.activeTab !== tab) this.setState({ activeTab: tab })
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <ModalTogglebar toggleModal={this.toggleModal} isActive={this.state.activeTab} tabs={toggleBarTabs}/>
        {this.state.activeTab === 'FAQ' && <FAQ/>}
        {this.state.activeTab === 'Terms & Conditions' && <TermsAndConditions/>}
      </Container>
    )
  }
}



