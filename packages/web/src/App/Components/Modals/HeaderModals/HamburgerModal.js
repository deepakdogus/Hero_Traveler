import React from 'react'
import styled from 'styled-components'
import { RightModalCloseXonRight, HamburgerTitle } from '../Shared'
import Avatar from '../../Avatar'
import { usersExample } from '../../../Containers/Feed_TEST_DATA'

const Container = styled.div`
  flex: 1;
`

export default class HamburgerModal extends React.Component {
  render() {
    const user = usersExample['59d50b1c33aaac0010ef4b3f']
    console.log('hey this is the user :', user)
  return (
    <Container>
      <RightModalCloseXonRight name='closeDark' onClick={this.props.closeModal}/>
      <Avatar size='medium'/>
      <HamburgerTitle>{user.username}</HamburgerTitle>
    </Container>
  )
  }
}
