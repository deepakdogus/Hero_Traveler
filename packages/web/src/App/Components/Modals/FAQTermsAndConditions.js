import React from 'react'
import styled from 'styled-components'

import {CenterTitle} from './Shared'
import FAQScreen from '../FAQScreen'
import TermsAndConditionsScreen from '../TermsAndConditionsScreen'
import ModalTogglebar from '../ModalTogglebar'

const toggleBarTabs = [
  { text: 'FAQ', isActive: true, isLast: false },
  { text: 'Terms & Conditions', isActive: false, isLast: true },
]

const Container = styled.div`
  padding: 25px;
`

export default class FAQTermsAndConditions extends React.Component {

    //temporary screen switch
    constructor(props) {
    super(props)
    this.state = {modal: 'FAQScreen' }
  }

  render() {
    return (
      <Container>
        <ModalTogglebar tabs={toggleBarTabs}/>
        {this.state.modal === 'FAQScreen' ? <FAQScreen/> : <TermsAndConditionsScreen/>}
      </Container>
    )
  }
}
