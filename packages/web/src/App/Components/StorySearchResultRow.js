import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import SpaceBetweenRowWithButton from './SpaceBetweenRowWithButton'
import VerticalCenter from './VerticalCenter'
import getImageUrl from '../Shared/Lib/getImageUrl'
import HorizontalDivider from './HorizontalDivider'


const Container = styled.div`
`

const StyledHorizontalDivider = styled(HorizontalDivider)`
  margin: 0;
`

export const StyledVerticalCenter = styled(VerticalCenter)`
  height: 100%;
  padding-left: 25px;
`

export const StoryName = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 600;
  font-size: 18px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  margin: 0;
`

export const UserName = styled.p`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 14px;
  font-style: italic;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  margin: 0;
`

const StyledImage = styled.img`
  width: 80px;
  height: 110px;
`

const CategoriesContainer = styled(Container)`
  padding: 10px 0px 6px;
`

const TopSpacer = styled.div`
  margin-top: 34px;
`

export default class StorySearchResultRow extends Component {
  static propTypes = {
    story: PropTypes.object,
    author: PropTypes.string,
    title: PropTypes.string,
    margin: PropTypes.string,
    image: PropTypes.object,
    index: PropTypes.number,
  }


  renderImage = () => {
    return (
      <StyledImage
        src={getImageUrl(this.props.image)}
      />
    )
  }

  renderText = () => {
    return (
      <StyledVerticalCenter>
        <StoryName>{this.props.title}</StoryName>
        <UserName>{this.props.author}</UserName>
      </StyledVerticalCenter>
    )
  }

  renderButton = () => {
    return null
  }

  render() {
    return (
      <Container>
        {this.props.index < 1 ? <TopSpacer/> : <StyledHorizontalDivider color='light-grey'/>}
        <CategoriesContainer margin={this.props.margin}>
          <SpaceBetweenRowWithButton
            renderImage={this.renderImage}
            renderText={this.renderText}
            renderButton={this.renderButton}
          />
        </CategoriesContainer>      
      </Container>
    )
  }
}
