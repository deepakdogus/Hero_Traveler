import styled from 'styled-components'
import { getSize } from './Image'

export default styled.div`
  width: ${props => getSize};
  height: ${props => getSize};
  border-radius: ${props => props.type !== undefined ? '100%' : '0'};
`
