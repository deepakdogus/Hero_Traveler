import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Row} from './FlexboxGrid'
import {Text} from './Modals/Shared'

const StyledRow = styled(Row)`
  
`

const TabContainer = styled.div`
  cursor: pointer;
`

const TabText = styled(Text)`
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.navBarText};
  border-width: ${props => props.isLast ? '0 0 0 0' : '0 1px 0 0' };
  border-style: solid;
  letter-spacing: 1.5px;
  border-color:  ${props => props.theme.Colors.navBarText};
  margin: 25px 0 25px 0;
  padding: 0 25px 0 25px;
`

export default class ModalToggleBar extends React.Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        isActive: PropTypes.bool,
        isLast: PropTypes.bool,
      }),
    ),
    toggleModal: PropTypes.func,
  }

  renderTabs(){
    const tabs = this.props.tabs || {}
    return tabs.map((tab, index) => {
      return (
        <TabContainer onClick={this.props.toggleModal} key={index}>
          <TabText isLast={tab.isLast} isActive={tab.isActive}>{tab.text}</TabText>
        </TabContainer>
      )
    })
  }

  render() {
    return (
      <StyledRow center='xs'>
        {this.renderTabs()}
      </StyledRow>
    )
  }
}
