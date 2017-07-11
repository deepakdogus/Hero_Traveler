import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const TabContainer = styled.div`
  display: inline-block;
  padding: 0px 10px;
`

const TabText = styled.p`
  color: white;
`

const Underline = styled.div`
  background-color: red;
  width: 100%;
  height: 3px;
`

export default class HeaderTab extends React.Component {
  static propTypes = {
    isActive: PropTypes.bool,
    text: PropTypes.string,
  }

  render() {
    const {isActive, text} = this.props
    return (   
      <TabContainer>
        <TabText>{text}</TabText>
        {isActive && <Underline/>}
      </TabContainer>
    )
  }
}