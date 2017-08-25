import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import TextButton from './TextButton'
import {StyledVerticalCenter} from './Modals/Shared'
import HorizontalDivider from './HorizontalDivider'
import Icon from './Icon'

const Container = styled.div`
  margin: ${props => props.margin ? props.margin : '0'};
`

const StyledIcon = styled(Icon)`
  padding: 0;
  align-self: center;
`

const IconContainer = styled(VerticalCenter)`
  height: 30px;
  width: 30px;
`

const ServiceTitle = styled.p`
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
  margin: 0;
  color: ${props => props.theme.Colors.grey};
`

const RowSpacer = styled.div`
  padding: 6px 0px;
`

const RenderedIcon = styled(StyledIcon)`
  width: ${props => {
    switch(props.service) {
      case 'facebook':
        return '15px'
      case 'twitter':
        return '26px'
      default:
        return '25px'
    }
  }};
  height: ${props => {
    switch(props.service) {
      case 'facebook':
        return '25px'
      case 'twitter':
        return '22px'
      default:
        return '25px'
    }
  }};  
  padding: ${props => {
    switch(props.service) {
      case 'facebook':
        return '0 9px'
      case 'twitter':
        return ''
      default:
        return '0 2.5px'
    }
  }};
`

export default class ServiceIconRow extends Component {

  static PropTypes = {
    isConnected: PropTypes.bool,
    iconName: PropTypes.oneOf(['facebook-blue', 'twitter-blue', 'instagram']),
    text: PropTypes.string,
    service: PropTypes.string,
    index: PropTypes.num,
  }

  renderImage = () => {
    return (
      <IconContainer>
        <RenderedIcon service={this.props.service} name={this.props.iconName}/>
      </IconContainer>
    )
  }

  renderText = () => {
    return (
      <StyledVerticalCenter>
        <ServiceTitle>{this.props.text}</ServiceTitle>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return (
      <VerticalCenter>
        <TextButton
          text={this.props.isConnected ? 'Disconnect' : 'Connect'}
          type={this.props.isConnected ? 'blackWhite' : undefined}
          margin='none'
          width='138px'
          textAlign='right'
        />
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container margin={this.props.margin}>
        {this.props.index > 0 ? null : <HorizontalDivider color='light-grey'/>}
         <RowSpacer>
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />           
         </RowSpacer> 
        <HorizontalDivider color='light-grey'/>
      </Container>
    )
  }
}
