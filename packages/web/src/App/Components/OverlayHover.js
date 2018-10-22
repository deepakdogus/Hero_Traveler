import styled from 'styled-components'

// overlay defaults to white with .4 opacity

// N.B. I am removing the &:after { } portion of this because as of 12/14/17, we are only
// using OverlayHover in one place, ExploreGrid
export default styled.div`
  &:hover { 
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
        case 'light-black':
          return 'rgba(0, 0, 0, 0.3)'
        default:
          return 'rgba(256, 256, 256, 0.4)'
      }
    }};
  }
`
