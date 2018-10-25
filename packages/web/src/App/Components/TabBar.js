import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Row} from './FlexboxGrid'
import {Text} from './Modals/Shared'
import VerticalCenter from './VerticalCenter'

const Container = styled.div`
  background-color: ${props => props.whiteBG ? props.theme.Colors.snow : props.theme.Colors.lightGreyAreas};
  margin: ${props => props.isModal ? '25px 0' : '0'};
`

const StyledRow = styled.div`
  display: flex;
  justify-content: center;
  max-width: 100%;
  flex-wrap: nowrap;
`

const TabContainer = styled.div`
  margin: ${props => props.isModal ? '0' : '0px 10px'};
  cursor: pointer;
  min-width: 100px;
  flex-shrink: ${props => props.isModal ? '1' : 'auto'};
  flex-grow: ${props => props.isModal ? '1' : 'auto'};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: ${props => props.isModal ? '0' : '0px 3px'};
    flex-shrink: 1;
  }
`

const ModalText = styled(Text)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.navBarText};
  border-width: ${props => props.isLast ? '0 0 0 0' : '0 1px 0 0' };
  border-style: solid;
  letter-spacing: .6px;
  border-color:  ${props => props.theme.Colors.navBarText};
  padding: ${props => props.isModal ? '0 15px 0 15px' : '0 25px 0 25px'};
  margin: 0;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: 0;
  }
`

const DefaultText = styled(VerticalCenter)`
  border-style: solid;
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.navBarText};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 13px;
  letter-spacing: .6px;
  border-width: ${props => !props.isOnlyTab && props.isActive ? '0 0 5px 0' : '0' };
  border-color:  ${props => props.theme.Colors.redHighlights};
  margin: 0;
<<<<<<< HEAD
  padding: 24px 10px;
=======
  padding: 12.5px 10px 12.5px;
>>>>>>> 1f7cd0bfe284ea83ec1a40ae59e082ef74b004e1
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 13px;
    padding: 12.5px 2vw;
  }
`

export default class TabBar extends React.Component {
  static propTypes = {
    tabs: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeTab: PropTypes.string.isRequired,
    onClickTab: PropTypes.func.isRequired,
    whiteBG: PropTypes.bool,
    isModal: PropTypes.bool,
  }

  renderTabs(){
    const {
      activeTab,
      tabs = [],
      onClickTab,
      isModal,
    } = this.props
    const Text = isModal ? ModalText : DefaultText
    return tabs.map((tab, index) => {
      return (
        <TabContainer
          key={index}
          onClick={onClickTab}
          isModal={isModal}
        >
          <Text
            isOnlyTab={tabs.length === 1}
            isActive={tab === activeTab}
            isLast={index === tabs.length - 1}
            isModal={isModal}
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
        <StyledRow isModal={this.props.isModal}>
          {this.renderTabs()}
        </StyledRow>
      </Container>
    )
  }
}
