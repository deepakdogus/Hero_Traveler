import React, { Component } from 'react'
import Header from '../Components/Header'
import background from '../Shared/Images/BG.png'
import styled from 'styled-components'

const height = window.innerHeight;

const Container = styled.div`
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  height: ${() => `${height*.45}px`};
`

class Feed extends Component {
  render() {
    return (
      <Container>
        <Header isLoggedIn={true}/>
        <div className='feed'>
          <h1>Here is my feed</h1>
        </div>
      </Container>  
    );
  }
}

export default Feed;