import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import {RightModalCloseX} from './Shared'
import FAQScreen from '../FAQScreen'
import ModalTogglebar from '../ModalTogglebar'
import HorizontalDivider from '../HorizontalDivider'

const toggleBarTabs = [
  { text: 'FAQ', isActive: true, isLast: false },
  { text: 'Terms & Conditions', isActive: false, isLast: true },
]

const Container = styled.div`
  padding: 0px 15px;
`

export default class FAQ extends React.Component {
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
        <FAQScreen/>
      </Container>
    )
  }
}
