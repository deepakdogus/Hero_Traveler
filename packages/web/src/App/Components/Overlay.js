import styled from 'styled-components'

export const OverlayStyles = `
  &:after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 1;
    background: rgba(0, 0, 0, .3);
  }
`

export default styled.div`
  ${OverlayStyles}
`
