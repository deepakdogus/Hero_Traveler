import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightModalCloseX} from './Shared'
import FAQScreen from '../FAQScreen'
import TermsAndConditionsScreen from '../TermsAndConditionsScreen'
import ModalTogglebar from '../ModalTogglebar'
import HorizontalDivider from '../HorizontalDivider'

const toggleBarTabs = [
  { text: 'FAQ', isActive: false, isLast: false },
  { text: 'Terms & Conditions', isActive: true, isLast: true },
]

const Container = styled.div`
  padding: 25px;
`

export default class TermsAndConditions extends React.Component {
  static propTypes = {
    closeModal: PropTypes.func,
    toggleModal: PropTypes.func,
  }

  render() {
    return (
      <Container>
        <RightModalCloseX name='closeDark' onClick={this.props.closeModal}/>
        <ModalTogglebar toggleModal={this.props.toggleModal} tabs={toggleBarTabs}/>
        <HorizontalDivider color='light-grey'/>
        <TermsAndConditionsScreen/>
      </Container>
    )
  }
}
