import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import Avatar from './Avatar'
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

export default class AddToBoardRow extends Component {
  static propTypes = {
    category: PropTypes.object,
    index: PropTypes.number,
  }

  renderImage = () => {
    return (
      <StyledImage
        src={getImageUrl(this.props.category.image)}
      />
    )
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
        <input
          type='radio'
        />
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
