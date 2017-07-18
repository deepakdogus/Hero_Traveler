import styled from 'styled-components'

// overlay defaults to white with .4 opacity
export default styled.div`
  &:hover {
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      opacity: 1;
      background: ${props => `${props.overlayColor ? props.overlayColor : 'rgba(256, 256, 256, 0.4)'}`};
    }
  }
`
