import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect, withRouter } from 'react-router-dom';

const AuthRoute = ({ component: Component, isLoggedIn, ...rest }) => {
  const renderFunction = props => (
    isLoggedIn === true ?
      <Component {...props} /> :
      <Redirect to={{ pathname: '/' }}/>
  )

  return (<Route {...rest} render={renderFunction}/>)
};

function mapStateToProps(state) {
  return {
    isLoggedIn: state.login.isLoggedIn,
  };
}

export default withRouter(connect(mapStateToProps, null)(AuthRoute));
