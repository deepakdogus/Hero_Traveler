import styled from 'styled-components'

export default styled.img`
  width: ${props => props.type === 'avatar' ? '30px' : 'auto'};
  height: ${props => props.type === 'avatar' ? '30px' : 'auto'};
  border-radius: ${props => props.type === 'avatar' ? '30px' : '0'};
`