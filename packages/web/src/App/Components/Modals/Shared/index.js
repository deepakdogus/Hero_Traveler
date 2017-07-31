import styled from 'styled-components'

const basicTextStyle = `
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
`

export const Container = styled.div`
  padding: 0 10px;
`

export const Title = styled.p`
  font-weight: 400;
  font-size: 25px;
  color: ${props => props.theme.Colors.background};
  letter-spacing: 1.2px;
  text-align: center;
`

export const StyledText = styled.p`
  ${basicTextStyle};
  color: ${props => props.theme.Colors.grey};
  text-align: center;
`

export const HasAccount = styled(StyledText)`
  font-size: 15px;
  margin-top: 30px;
`

export const SignupText = styled.span`
  ${basicTextStyle};
  font-size: 15px;
  margin-top: 15px;
  font-weight: 600;
  color: ${props => props.theme.Colors.redHighlights};
  display: inline;
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
