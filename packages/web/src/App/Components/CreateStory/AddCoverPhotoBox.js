import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Icon from '../Icon'

const CenteredText = styled.p`
  text-align: center;
  color: ${props => props.theme.Colors.background}
`

const Container = styled.div`
  max-width: 900px;
  max-height: 505px;
  padding: 80px 0px;
  background-color: ${props => props.theme.Colors.pink};
  border: 1px dashed ${props => props.theme.Colors.redHighlights}
`

const IconSubTitle = styled(CenteredText)`
  font-weigth: 400;
  font-size: 13px;
  letter-spacing: 1.5px;
  color: ${props => props.theme.Colors.redHighlights}
`

const StyledIcon = styled(Icon)`
  height: 25px;
  margin-top: 10px;
`

const IconContainer = styled.div`
  text-align: center;
`

const SubTitle = styled(CenteredText)`
  font-weigth: 400;
  font-size: 20px;
  letter-spacing: .7px;
`


const Title = styled(CenteredText)`
  font-weigth: 400;
  font-size: 50px;
  letter-spacing: 1.5px;
`

export default class AddCoverPhotoBox extends React.Component {
  static propTypes = {
    action: PropTypes.func,
  }

  render() {
    return (
      <Container>
        <IconContainer><StyledIcon name='components'/></IconContainer>
          <IconSubTitle>+ ADD A COVER PHOTO</IconSubTitle>
          <Title>ADD TITLE</Title>
        <SubTitle>Add a subtitle</SubTitle>        
      </Container>

      )
  }
}