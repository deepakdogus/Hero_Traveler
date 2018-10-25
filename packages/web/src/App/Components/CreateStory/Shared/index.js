import styled from 'styled-components'

export const Title = styled.p`
  font-weight: 400;
  font-size: 25px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-align: center;
`

export const SubTitle = styled.p`
  text-align: center;
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 20px;
  letter-spacing: .2px;
`

export const CloseXContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  margin: 10px;
  z-index: 100;
`

export const Input = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .2px;
  width: 80%;
  text-align: center;
  border: none;
  outline: none;
`

export const StyledCaptionInput = styled(Input)`
  font-style: italic;
  width: 100%;
  color: ${props => props.theme.Colors.grey};
  padding-top: 20px;
  font-size: 18px;
  font-style: italic
`
