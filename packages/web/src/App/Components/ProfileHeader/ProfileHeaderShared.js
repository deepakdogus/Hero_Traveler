import styled from 'styled-components'

import Avatar from '../Avatar'
import VerticalCenter from '../VerticalCenter'

export const UsernameBaseStyles = `
  font-weight: 600;
  font-size: 40px;
  margin: 0 0 0 -2px;
  text-align: left;
`

export const Username = styled.p`
  ${UsernameBaseStyles};
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  color: ${props => props.theme.Colors.background};
`

export const Name = styled.p`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro}};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  margin: 0;
  text-align: left;
`

export const ItalicText = styled.p`
  font-family: ${props => props.theme.Fonts.type.crimsonText}};
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .5px;
  font-style: italic;
  margin: 0;
`

export const Centered = styled(VerticalCenter)`
  margin-top: 65px;
  height: 365px;
`

export const StyledAvatar = styled(Avatar)``

export const AvatarWrapper = styled(VerticalCenter)`
  position: relative;
  height: 131px;
`

export const ButtonWrapper = styled.div`
  margin-top: 10px;
  text-align: left;
`

export const BottomLeft = styled.div`
  position: absolute;
  left: 20px;
  bottom: 90px;
  z-index: 2;
`

export const BottomLeftText = styled.p`
  font-family: ${props => props.theme.Fonts.type.montserrat}};
  font-weight: 400;
  font-size: 12px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: 1px;
  margin: 0;
  padding-left: 10px;
  line-height: 25px;
`

export const Container = styled.div`
  margin-top: 65px;
  position: relative;
`
