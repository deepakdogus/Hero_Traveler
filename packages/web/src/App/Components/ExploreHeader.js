import React from 'react'
import styled from 'styled-components'

import Header from './Header'
import background from '../Shared/Images/create-story.png'
import HeaderImageWrapper from './HeaderImageWrapper'

const OpaqueHeaderImageWrapper = styled(HeaderImageWrapper)`
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

export default class ExploreHeader extends React.Component {
  static propTypes = {

  }

  constructor(props) {
    super(props)
    this.state = {modal: undefined}
  }

  render () {
    return (
      <OpaqueHeaderImageWrapper
        backgroundImage={background}
        size='large'
        type='profile'
      >
        <Header ></Header>
      </OpaqueHeaderImageWrapper>
    )
  }
}
