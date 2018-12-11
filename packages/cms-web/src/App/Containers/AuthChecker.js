import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from './Login';

const AuthChecker = ({ children, userId, isResumingSession, ...rest }) => {
  return userId
    ? <div>{children}</div>
    : <Login />
};

function mapStateToProps(state) {
  console.log('state', state);
  return {
    isResumingSession: state.session.isResumingSession,
    userId: state.session.userId,
  };
}

AuthChecker.propTypes = {
  children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
  ]).isRequired,
  userId: PropTypes.string,
  isResumingSession: PropTypes.bool,
}

export default connect(mapStateToProps, null)(AuthChecker);
