import React from 'react'
import styled from 'styled-components'

import { AbstractStarRating } from '../../Shared/AbstractComponents'
import Icon from '../Icon'

const Container = styled.div`
  display: flex;
`

const ClickContainer = styled.div`
  cursor: ${props => (props.clickable ? 'pointer' : 'auto')};
`

const Star = styled(Icon)`
  cursor: ${props => (props.clickable ? 'pointer' : 'auto')};
`

class StarRating extends AbstractStarRating {
  render() {
    return (
      <Container>
        {[1, 2, 3, 4, 5].map(rating => (
          <ClickContainer
            key={rating}
            onClick={this.handleStarClick(rating)}
            clickable={!!this.props.onChange}
          >
            <Star
              name={
                rating <= this.props.valueSelected
                  ? 'ratingStarActive'
                  : 'ratingStarInactive'
              }
              clickable={!!this.props.onChange}
            />
          </ClickContainer>
        ))}
      </Container>
    )
  }
}

export default StarRating
