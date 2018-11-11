import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  background-color: #ed1e2e;
  display: inline-flex;
  position: absolute;
  top: -15px;
  right: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  text-align: center;
  z-index: 50;
  margin: auto;
  cursor: pointer;
`

const Text = styled.p`
  color: #ffffff;
  font-size: 8px;
  margin: auto;
`

export default function NotificationsBadge({count, onClick}) {
  return (
    <Container onClick={onClick}>
      <Text>{count}</Text>
    </Container>
  )
}

NotificationsBadge.propTypes = {
  count: PropTypes.number,
  onClick: PropTypes.func,
  styles: PropTypes.object,
}
