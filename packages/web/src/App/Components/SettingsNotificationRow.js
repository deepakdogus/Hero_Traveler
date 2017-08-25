import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithTextAndSwitch from './SpaceBetweenRowWithTextAndSwitch'
import VerticalCenter from './VerticalCenter'
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

const RowSpacer = styled.div`
  padding: 6px 0px;
`

export default class SettingsNotificationRow extends Component {
    constructor(props) {
    super(props);
    
    this.state = {
      checked: true,
    };
  }

  static PropTypes = {
    isNotifying: PropTypes.bool,
    text: PropTypes.string,
    index: PropTypes.num,
    toggleNotificationSwitch: PropTypes.func,
    logOnChange: PropTypes.func,
  }

  renderText = () => {
    return (
      <VerticalCenter>
        <NotificationTitle>{this.props.text}</NotificationTitle>
      </VerticalCenter>
    )
  }

  renderSwitch = () => {
    const { checked } = this.state;
    return (
      <VerticalCenter>
        <Switch
          checked={checked}
          index={this.props.index}
          disabled={null}
          onChange={checked => this.setState({ checked })}
          onColor={'#d60000'}
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        {this.props.index > 0 ? null : <HorizontalDivider color='light-grey'/>}
        <RowSpacer>
          <SpaceBetweenRowWithTextAndSwitch
            renderText={this.renderText}
            renderSwitch={this.renderSwitch}
          />
        </RowSpacer>
          <HorizontalDivider color='light-grey'/>
      </Container>
    )
  }
}
