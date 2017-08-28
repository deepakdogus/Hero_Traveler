import React, { Component } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import Togglebar from './Togglebar'



const togglebarTabs = [
  { text: 'stories', isActive: false },
  { text: 'people', isActive: true },
]

const StyledTogglebar = styled(Togglebar)`
  background-color: ${props => props.theme.Colors.clear}
`

const Container = styled.div``

const ContentWrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
`

export default class SearchResultsPeople extends Component {
  static PropTypes = {
    toggleSearchResultTabs: PropTypes.func,
  }
  constructor(props) {
    super(props)
    this.state = {}
  }


  render() {
    return (
      <Container>
        <ContentWrapper>
          <StyledTogglebar 
            tabs={togglebarTabs}
            isClear={true}
            onClick={this.props.toggleSearchResultTabs}
          />
          PEOPLE
        </ContentWrapper>

      </Container>
    )
  }
}

