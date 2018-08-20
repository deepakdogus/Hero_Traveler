import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

const Container = styled.div`
  background-color: #ed1e2e;
  display: inline-flex;
  position: absolute;
  top: -20px;
  right: 6px;
  width: 25px;
  height: 25px;
  border-radius: 50%;
  text-align: center;
  z-index: 50;
  margin: auto;
`

const Text = styled.p`
  color: #ffffff;
  font-size: 9px;
  margin: auto;
  padding: 5px;
`

export default function NotificationsBadge({count}) {
  return (
    <Container>
      <Text>{count}</Text>
    </Container>
  )
}

NotificationsBadge.propTypes = {
  count: PropTypes.number,
  styles: PropTypes.object,
}

