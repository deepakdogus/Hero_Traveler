import styled from 'styled-components'

const basicTextStyle = `
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
`

const CenteredText = styled.p`
  text-align: center;
`

export const Title = styled.p`
  font-weight: 400;
  font-size: 25px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-align: center;
`

export const StyledInput = styled.input`
  ${basicTextStyle};
  width: 100%;
  color: ${props => props.theme.Colors.grey};
  padding-bottom: 5px;
  border-width: 0 0 1px;
  border-color: ${props => props.theme.Colors.dividerGrey};
  margin-bottom: 25px;
`

export const SubTitle = styled(CenteredText)`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weigth: 400;
  font-size: 20px;
  letter-spacing: .7px;
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
  letter-spacing: .7px;
  width: 80%;
  text-align: center;
  border: none;
  outline: none;
`

export const CenteredInput = styled.input`
  font-family: ${props => props.theme.Fonts.type.base};
  font-weight: 400;
  color: ${props => props.theme.Colors.background};
  letter-spacing: .7px;
  width: 80%;
  text-align: center;
  border: none;
  outline: none;
`

export const StyledCaptionInput = styled(CenteredInput)`
  font-style: italic;
  width: 100%;
  color: ${props => props.theme.Colors.grey};
  padding-top: 20px;
  font-size: 18px;
  font-style: italic
`