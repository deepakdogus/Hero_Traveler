import styled from 'styled-components'
import React from 'react'
import RotatedArrow from './RotatedArrow'

const Container = styled.div``

const More = styled.p`
  color: ${props => props.theme.Colors.background};
  font-family: ${props => props.theme.Fonts.type.montserrat};
  font-size: 15px;
  letter-spacing: .6px;
  margin: 100px 0 8px 0;
  text-align: center;
`

const ArrowContainer = styled.div`
  text-align: center;
  margin-bottom: 120px;
`

const ShowMore = props => {
  return (
    <Container>
      <More>SHOW MORE</More>
      <ArrowContainer>
        <RotatedArrow
          name='arrowRightRed'
          size='mediumSmall'
        />
      </ArrowContainer>
    </Container>
  )
}

export default ShowMore
