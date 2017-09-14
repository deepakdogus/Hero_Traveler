import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'
import {SubTitle, Input} from './Shared'

const Container = styled.div`
  max-width: 900px;
  max-height: 505px;
  padding: 100px 0px 120px 0px;
  background-color: ${props => props.theme.Colors.pink};
  border: 1px dashed ${props => props.theme.Colors.redHighlights}
`

const IconSubTitle = styled(SubTitle)`
  font-weight: 400;
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

const StyledTitleInput = styled(Input)`
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

const StyledSubTitleInput = styled(Input)`
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
    const { action } = this.props
    return (
      <Container>
        <IconContainer onClick={action}><StyledIcon name='components'/></IconContainer>
          <IconSubTitle onClick={action}>+ ADD A COVER PHOTO</IconSubTitle>
          <TitleInputsContainer>
            <StyledTitleInput placeholder='ADD TITLE'/>
            <StyledSubTitleInput placeholder='Add a subtitle'/>
          </TitleInputsContainer>
      </Container>

      )
  }
}
