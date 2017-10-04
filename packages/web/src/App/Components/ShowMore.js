import styled from 'styled-components'
import React from 'react'
import Icon from './Icon'

const Container = styled.div``

const More = styled.p`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 15px;
  letter-spacing: 1.2px;
  margin: 100px 0 8px 0;
  text-align: center;
`

const ArrowContainer = styled.div`
  text-align: center;
  margin-bottom: 220px;
`

const ArrowIcon = styled(Icon)`
  text-align: center;
  height: 24px;
  width: 12px;
  -ms-transform: rotate(90deg);
  -webkit-transform: rotate(90deg);
  transform: rotate(90deg);
`

const ShowMore = props => {
  return (
    <Container>
      <More>SHOW MORE</More>
      <ArrowContainer>
        <ArrowIcon
          name='arrowRightRed'
          size='mediumSmall'
        />
      </ArrowContainer>
    </Container>
  )
}

export default ShowMore
