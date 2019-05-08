import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import VerticalCenter from '../Shared/Web/Components/VerticalCenter'
import HorizontalDivider from './HorizontalDivider'
import {Row} from '../Shared/Web/Components/FlexboxGrid'
import {Colors} from '../Shared/Themes'

import 'react-ios-switch/build/bundle.css'
import Switch from 'react-ios-switch'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

const NotificationTitle = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .2px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-left: 25px;
  }
`

const RowSpacer = styled.div`
  padding: 6px 0px;
`

const StyledSwitch = styled(Switch)`
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    margin-right: 25px;
  }
`

export default class EditNotificationRow extends Component {
  static propTypes = {
    text: PropTypes.string,
    index: PropTypes.number,
    toggleNotificationSwitch: PropTypes.func,
    checked: PropTypes.bool,
    value: PropTypes.string,
  }

  _toggleNotificationSwitch = () => {
    this.props.toggleNotificationSwitch(this.props.value)
  }

  renderText = () => {
    return (
      <VerticalCenter>
        <NotificationTitle>{this.props.text}</NotificationTitle>
      </VerticalCenter>
    )
  }

  renderSwitch = () => {
    return (
      <VerticalCenter>
        <StyledSwitch
          checked={this.props.checked}
          index={this.props.index}
          disabled={null}
          onChange={this._toggleNotificationSwitch}
          onColor={Colors.red}
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        {this.props.index > 0 ? null : <HorizontalDivider color='light-grey'/>}
        <RowSpacer>
          <Row between='xs'>
            <Row>
              {this.renderText()}
            </Row>
            <Row>
              {this.renderSwitch()}
            </Row>
          </Row>
        </RowSpacer>
          <HorizontalDivider color='light-grey'/>
      </Container>
    )
  }
}
