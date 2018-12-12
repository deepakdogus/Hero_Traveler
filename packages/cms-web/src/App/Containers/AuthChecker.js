import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Login from './Login'
import Loader from '../Components/Loader'
import VerticalCenter from '../Components/VerticalCenter'

const LoaderWrapper = styled.div`
  align-self: center;
  display: flex;
`

const AuthChecker = ({ children, userId, isSessionLoading, ...rest }) => {
  if (isSessionLoading) {
    return (
      <VerticalCenter>
        <LoaderWrapper>
          <Loader />
        </LoaderWrapper>
      </VerticalCenter>
    )
  }
  return userId
    ? <div>{children}</div>
    : <Login />
}

function mapStateToProps(state) {
  return {
    isResumingSession: state.session.isResumingSession,
    userId: state.session.userId,
    isSessionLoading: state.session.isSessionLoading,
  }
}

AuthChecker.propTypes = {
  children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
  ]).isRequired,
  userId: PropTypes.string,
  isResumingSession: PropTypes.bool,
  isSessionLoading: PropTypes.bool,
}

export default connect(mapStateToProps, null)(AuthChecker)
