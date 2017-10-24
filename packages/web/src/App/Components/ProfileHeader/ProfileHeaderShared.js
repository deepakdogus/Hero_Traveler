import styled from 'styled-components'

import Avatar from '../Avatar'
import VerticalCenter from '../VerticalCenter'

export const Username = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  font-weight: 400;
  font-size: 30px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1.5px;
  text-transform: uppercase;
  margin: 0;
`

export const ItalicText = styled.p`
  font-family: ${props => props.theme.Fonts.type.crimsonText}};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: .5px;
  font-style: italic;
  margin: 0;
`

export const Centered = styled(VerticalCenter)`
  position: absolute;
  width: 100vw;
  height: 630px;
  top:0;
  text-align:center;
  z-index: 2;
`

export const StyledAvatar = styled(Avatar)`
  margin: 0 auto;
`

export const AvatarWrapper = styled.div`
  position: relative;
  margin: 25px 0;
`

export const ButtonWrapper = styled.div`
  margin-top: 25px;
`

export const BottomLeft = styled.div`
  position: absolute;
  left: 20px;
  bottom: 20px;
  z-index: 1;
`

export const BottomLeftText = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme.Colors.snow};
  letter-spacing: 1px;
  margin: 0;
  padding-left: 10px;
  line-height: 25px;
`

export const Container = styled.div``
