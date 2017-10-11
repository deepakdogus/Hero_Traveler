import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Row} from './FlexboxGrid'
import {Text} from './Modals/Shared'

const Container = styled.div`
  background-color: ${props => props.whiteBG ? props.theme.Colors.snow : props.theme.Colors.lightGreyAreas};
  margin: ${props => props.isModal ? '25px 0' : '0'};
`

const TabContainer = styled.div`
  padding: ${props => props.isModal ? '0' : '0px 10px'};
  cursor: pointer;
`

const ModalText = styled(Text)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.navBarText};
  border-width: ${props => props.isLast ? '0 0 0 0' : '0 1px 0 0' };
  border-style: solid;
  letter-spacing: 1.5px;
  border-color:  ${props => props.theme.Colors.navBarText};
  padding: 0 25px 0 25px;
  margin: 0;
`

const DefaultText = styled.p`
  border-style: solid;
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.navBarText};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 18px;
  letter-spacing: 1.2px;
  border-width: ${props => props.isActive ? '0 0 5px 0' : '0' };
  border-color:  ${props => props.theme.Colors.redHighlights};
  margin: 0;
  padding: 12.5px 10px 12.5px;
`

export default class TabBar extends React.Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string),
    activeTab: PropTypes.string,
    onClickTab: PropTypes.func,
    whiteBG: PropTypes.bool,
    isModal: PropTypes.bool,
  }

  nullFunc(){
    return null
  }

  renderTabs(){
    const {activeTab, tabs = [], onClickTab, isModal} = this.props
    const onClickFunction = onClickTab || this.nullFunc
    const Text = isModal ? ModalText : DefaultText
    return tabs.map((tab, index) => {
      return (
        <TabContainer
          key={index}
          onClick={onClickFunction}
          isModal={isModal}
        >
          <Text
            isActive={tab === activeTab}
            isLast={index === tabs.length - 1}
          >
            {tab}
          </Text>
        </TabContainer>
      )
    })
  }

  render() {
    return (
      <Container whiteBG={this.props.whiteBG} isModal={this.props.isModal}>
        <Row center='xs'>
          {this.renderTabs()}
        </Row>
      </Container>
    )
  }
}
