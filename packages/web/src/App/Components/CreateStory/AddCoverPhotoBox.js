import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {Title, SubTitle, CenteredText, CenteredInput} from './Shared'

const Container = styled.div`
  max-width: 900px;
  max-height: 505px;
  padding: 100px 0px 120px 0px;
  background-color: ${props => props.theme.Colors.pink};
  border: 1px dashed ${props => props.theme.Colors.redHighlights}
`

const IconSubTitle = styled(SubTitle)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 13px;
  letter-spacing: 1.5px;
  color: ${props => props.theme.Colors.redHighlights}
`

const StyledIcon = styled(Icon)`
  height: 40px;
  width: 40px;
  margin-top: 10px;
`

const IconContainer = styled.div`
  text-align: center;
  height: 100%;
  width: 100%;
`

const StyledTitleInput = styled(CenteredInput)`
  font-family: ${props => props.theme.Fonts.type.montserrat};
  background-color: ${props => props.theme.Colors.pink};
  font-size: 50px;
  margin-top: 46px;
  letter-spacing: 1.5px;
  ::-webkit-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  :-ms-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  ::-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }
  :-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }
`

const StyledSubTitleInput = styled(CenteredInput)`
  background-color: ${props => props.theme.Colors.pink};
  font-size: 20px;
  ::-webkit-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  :-ms-input-placeholder {
    color: ${props => props.theme.Colors.background};
  }
  ::-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }
  :-moz-placeholder {
    color: ${props => props.theme.Colors.background};
    opacity: 1;
  }  
`

const TitleInputsContainer = styled.div`
    text-align: center;
`

export default class AddCoverPhotoBox extends React.Component {
  static propTypes = {
    action: PropTypes.func,
  }

  render() {
    return (
      <Container>
        <IconContainer onClick={this.props.action}><StyledIcon name='components'/></IconContainer>
          <IconSubTitle onClick={this.props.action}>+ ADD A COVER PHOTO</IconSubTitle>
          <TitleInputsContainer>
            <StyledTitleInput placeholder='ADD TITLE'/>
            <StyledSubTitleInput placeholder='Add a subtitle'/>            
          </TitleInputsContainer>  
      </Container>

      )
  }
}