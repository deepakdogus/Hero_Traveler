import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const Text = styled.span`
  font-family: ${props => props.theme.Fonts.type.sourceSansPro};
  font-weight: 400;
  letter-spacing: .2px;
  font-size: 25px;
  color: ${props => props.theme.Colors.grey};
  @media (max-width: ${props => props.theme.Metrics.sizes.tablet}px) {
    font-size: 12px;
  }
`

const SmallText = styled(Text)`
  font-size: 15px;
`

const MessageWrapper = styled.div`
  height: 257px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const FeedItemMessage = ({ message, smallMessage }) => (
  <MessageWrapper>
    <Text>{message}</Text>
    {smallMessage && <SmallText>{smallMessage}</SmallText>}
  </MessageWrapper>
)

export default FeedItemMessage

FeedItemMessage.propTypes = {
  message: PropTypes.string,
  smallMessage: PropTypes.string,
}
