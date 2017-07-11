import React, { Component } from 'react'
import Header from '../Components/Header'
import background from '../Shared/Images/BG.png'
import styled, {ThemeProvider} from 'styled-components'
import themes from '../Shared/Themes'

const Container = styled.div`
  background-image: url(${background});
  background-repeat: no-repeat;
  background-size: cover;
  height: ${(props) => `${props.theme.Metrics.screenHeight*.45}px`};
`

class Feed extends Component {
  render() {
    return (
      <ThemeProvider theme={themes}>
        <Container>
          <Header isLoggedIn={true}/>
          <div className='feed'>
            <h1>Here is my feed</h1>
          </div>
        </Container>
      </ThemeProvider>
    )
  }
}

export default Feed