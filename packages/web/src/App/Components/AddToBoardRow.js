import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import HorizontalDivider from './HorizontalDivider'
import {
  StyledVerticalCenter,
  UserName,
} from './Modals/Shared'

const Container = styled.div`

`

const StyledImage = styled.img`
  width: 80px;
  height: 110px;
`

const CategoriesContainer = styled(Container)`
  padding: 0px 30px;
`

const styles = {
  radioButton: {
    // display: 'inline-block',
  },
  radioIcon: {
    fill: `${props => props.theme.Colors.redLight}`,
  },
  radioButtonGroup: {
    // marginLeft: 40,
  },
}

export default class AddToBoardRow extends Component {
  static propTypes = {
    category: PropTypes.object,
    index: PropTypes.number,
    closeModal: PropTypes.func,
  }

  renderImage = () => {
    return (
      <StyledImage
        src={getImageUrl(this.props.category.image)}
      />
    )
  }

  closeModalWithDelay = () => {
    alert("YOU HAVE ADDED TO YOUR COLLECTION")
    setTimeout(this.props.closeModal, 1000)
  }

  renderText = () => {
    return (
      <StyledVerticalCenter>
        <UserName>{this.props.category.title}</UserName>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return (
      <VerticalCenter>
        <RadioButtonGroup 
          name="category"
          onChange={this.closeModalWithDelay}
          defaultSelected="default"
          style={styles.radioButtonGroup}
        >
          <RadioButton
            value=""
            style={styles.radioButton}
            labelStyle={styles.radioButtonLabel}
            iconStyle={styles.radioIcon}
          />
        </RadioButtonGroup>          
      </VerticalCenter>
    )
  }

  render() {
    return (
      <Container>
        {this.props.index < 1 ? <HorizontalDivider color='light-grey'/> : null}
        <CategoriesContainer margin={this.props.margin}>
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />
        </CategoriesContainer>
        <HorizontalDivider color='light-grey'/>        
      </Container>
    )
  }
}
