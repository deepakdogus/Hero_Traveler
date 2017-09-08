import styled from 'styled-components'

const basicTextStyle = `
  font-weight: 400;
  font-size: 16px;
  letter-spacing: .7px;
`
export const CenteredText = styled.p`
  text-align: center;
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

export const Text = styled.p`
  ${basicTextStyle};
  color: ${props => props.theme.Colors.grey};
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
  font-weigth: 400;
  font-size: 20px;
  letter-spacing: .7px;
`