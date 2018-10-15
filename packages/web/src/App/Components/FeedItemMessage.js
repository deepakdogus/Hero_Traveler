import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Text = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .7px;
  font-size: 25px;
  color: ${props => props.theme.Colors.grey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const MessageWrapper = styled.div`
  height: 257px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FeedItemMessage = ({ message }) => (
  <MessageWrapper>
    <Text>{message}</Text>
  </MessageWrapper>
)

export default FeedItemMessage

FeedItemMessage.propTypes = {
  message: PropTypes.string,
}
