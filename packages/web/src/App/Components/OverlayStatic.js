import styled from 'styled-components'

// overlay defaults to white with .4 opacity
export default styled.div`
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    background: ${props => {
      switch (props.overlayColor) {
        case 'black':
          return 'rgba(0, 0, 0, 0.4)'
        case 'lightBlack':
          return 'rgba(0, 0, 0, 0.25)'
        default:
          return 'rgba(256, 256, 256, 0.4)'
      }
    }};
  }
`
