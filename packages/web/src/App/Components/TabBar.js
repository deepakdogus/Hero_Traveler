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

// need && hack because styled-component insertion order was placing Row styles
// behind the styled-compoenent styles, so they weren't overwriting base styles
const StyledRow = styled(Row)`
  && {
    flex-wrap: nowrap;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: auto;
    @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
      justify-content: ${props => props.overflows ? 'flex-start' : 'center'};
      -webkit-overflow-scrolling: touch;
      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
`

const TabContainer = styled.div`
  cursor: pointer;
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin: ${props => props.isModal ? '0' : '0 10px 0 0'};
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
  height: 100%;
  white-space: nowrap;
`

const DefaultText = styled(VerticalCenter)`
  color: ${props => props.isActive ? props.theme.Colors.background : props.theme.Colors.navBarText};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 13px;
  letter-spacing: .6px;
  border-bottom: ${props => !props.isOnlyTab && props.isActive ? 'solid' : 'transparent' };
  border-bottom-width: ${props => !props.isOnlyTab && props.isActive ? '5px' : '0' };
  border-bottom-color:  ${props => props.theme.Colors.redHighlights};
  border-top: 5px solid transparent;
  margin: 0;
  padding: 22px 10px;
  min-width: ${props => props.isModal ? 'auto' : '80px'};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    padding: ${props => props.isModal ? '0' : '13px 10px'};
    border-bottom-width: ${props => !props.isOnlyTab && props.isActive ? '3px' : '0' };
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
    const { whiteBG, isModal, tabs = [] } = this.props
    return (
      <Container whiteBG={whiteBG} isModal={isModal}>
        <StyledRow
          center='xs'
          overflows={tabs.length > 2}
        >
          {this.renderTabs()}
        </StyledRow>
      </Container>
    )
  }
}
