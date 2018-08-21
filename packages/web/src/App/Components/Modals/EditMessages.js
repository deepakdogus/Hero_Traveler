import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { ErrorMessage, FetchingMessage } from './Shared/'

const Container = styled.div`
  padding-right: 25px;
`


const EditMessages = (props) => {
  const {isUpdating, errorObj, localError, success} = props

  return(
    <Container>
      {localError &&
        <ErrorMessage>
          {localError}
        </ErrorMessage> }
      {!!(errorObj) &&
        <ErrorMessage>
          {errorObj.toString()}
        </ErrorMessage> }
      {isUpdating &&
        <FetchingMessage>
          Fetching...
        </FetchingMessage>}
      {success && !isUpdating &&
        <FetchingMessage>
          You have successfully changed your info.
        </FetchingMessage>}
    </Container>
  )
}

EditMessages.proptypes = {
    isUpdating: PropTypes.bool,
    errorObj: PropTypes.object,
    localError: PropTypes.string,
    success: PropTypes.bool,
}

export default EditMessages