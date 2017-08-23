import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithTextAndSwitch from './SpaceBetweenRowWithTextAndSwitch'
import VerticalCenter from './VerticalCenter'
import {StyledVerticalCenter} from './Modals/Shared'
import HorizontalDivider from './HorizontalDivider'

import 'react-ios-switch/build/bundle.css';
import Switch from 'react-ios-switch';

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

const NotificationTitle = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

export default class SettingsNotificationRow extends Component {

  static PropTypes = {
    isNotifying: PropTypes.bool,
    text: PropTypes.string,
  }

  renderText = () => {
    return (
      <StyledVerticalCenter>
        <NotificationTitle>{this.props.text}</NotificationTitle>
      </StyledVerticalCenter>
    )
  }

  renderSwitch = () => {
    return (
      <VerticalCenter>
        <Switch
          checked={this.props.isNotifying}
          disabled={null}
          onChange={null}
          onColor={'#d60000'}
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        <SpaceBetweenRowWithTextAndSwitch
          renderText={this.renderText}
          renderSwitch={this.renderSwitch}
        />
        <HorizontalDivider color='light-grey'/>
      </Container>
    )
  }
}
