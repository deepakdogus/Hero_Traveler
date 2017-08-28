import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Row} from './FlexboxGrid'

const StyledRow = styled(Row)`
  background-color: ${props => props.isClear ? props.theme.Colors.clear : props.theme.Colors.lightGreyAreas}
`

const TabContainer = styled.div`
  padding: 0px 10px;
`

const TabText = styled.p`
  font-size: 18px;
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.navBarText};
  letter-spacing: 1.2px;
  border-width: ${props => props.isActive ? '0 0 5px 0' : '0' };
  border-style: solid;
  border-color:  ${props => props.theme.Colors.redHighlights};
  margin: 0;
  padding: 12.5px 10px 12.5px;
  text-transform: uppercase;
`

export default class ToggleBar extends React.Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(
      PropTypes.shape({
        text: PropTypes.string,
        isActive: PropTypes.bool,
      })
    ),
    isClear: PropTypes.bool,
  }

  renderTabs(){
    const tabs = this.props.tabs || {}
    return tabs.map((tab, index) => {
      return (
        <TabContainer key={index}>
          <TabText isActive={tab.isActive}>{tab.text}</TabText>
        </TabContainer>
      )
    })
  }

  render() {
    return (
      <StyledRow isClear={this.props.isClear} center='xs'>
        {this.renderTabs()}
      </StyledRow>
    )
  }
}
