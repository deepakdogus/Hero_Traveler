import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const AuthRoute = ({ component: Component, userId, isResumingSession, ...rest }) => {
  const renderFunction = props => {
    if (isResumingSession) return null
    return !!userId ?
      <Component {...props} /> :
      <Redirect to={{ pathname: '/' }}/>
  }
  return (<Route {...rest} render={renderFunction}/>)
};

function mapStateToProps(state) {
  return {
    isResumingSession: state.session.isResumingSession,
    userId: state.session.userId,
  };
}

export default withRouter(connect(mapStateToProps, null)(AuthRoute));
