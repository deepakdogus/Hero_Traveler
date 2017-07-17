import styled from 'styled-components'

function getSize(props) {
  switch(props.type) {
    case 'avatar':
      return '30px'
    case 'avatar-large':
      return '60px'
    default:
      return 'auto'
  }
}


export default styled.img`
  width: ${props => getSize};
  height: ${props => getSize};
  border-radius: ${props => props.type !== undefined ? '30px' : '0'};
`