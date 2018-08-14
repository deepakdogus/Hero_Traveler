import styled from 'styled-components'

export default styled.div`
  font-weight: 400;
  font-size: 18px;
  color: ${props => props.theme.Colors.grey};
  letter-spacing: .7px;
  font-style: italic;
  text-align: center;
  margin-top: 0;
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
`