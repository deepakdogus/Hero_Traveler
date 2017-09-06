import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightModalCloseX} from './Shared'
import ModalTogglebar from '../ModalTogglebar'

import FAQ from './FAQ'
import TermsAndConditions from './TermsAndConditions'

const Container = styled.div``

export default class Settings extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
  }

  constructor(props) {
    super(props)
    this.state = {
      modalContent: 'faq',
      toggleBarTabs: [
        { text: 'FAQ', isActive: true, isLast: false },
        { text: 'Terms & Conditions', isActive: false, isLast: true },
      ],
    }
  }  

  toggleModal = (event) => {
    let target = event.target.innerHTML.split(' ')[0];
    let newTabs = [];
    this.state.toggleBarTabs.forEach(function(tab){
      let newTab = Object.assign({}, tab)
      newTab.isActive = tab.text.split(' ')[0] === target ? true : false;
      newTabs.push(newTab)
    })
    if(target === 'FAQ' || target === 'Terms'){
      this.setState({ modalContent: target.toLowerCase(), toggleBarTabs: newTabs })
    }
  }
 
  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <ModalTogglebar toggleModal={this.toggleModal} tabs={this.state.toggleBarTabs}/>
        {this.state.modalContent === 'faq' ? <FAQ/> : null }
        {this.state.modalContent === 'terms' ? <TermsAndConditions/> : null }
      </Container>
    )
  }
}
