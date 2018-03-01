import React, { Component } from 'react';
import { connect } from 'react-redux';
import { appKey } from '../../config';

export default ComposedComponent => {
  class RequireAuthentication extends Component {
    componentWillMount() {
      // Here, we want to check to see if `this.props.authenticated` is true
      // If it isn't, then redirect the user back to the /signin page
      if (!localStorage.getItem(appKey)) this.props.history.push('/signin');
    }

    render() {
      return (
        <div>{localStorage.getItem(appKey) ? <ComposedComponent /> : null}</div>
      );
      // Here, check to see if `this.props.authenticated` is true
      // If it isn't, then we don't want this component to return anything
      // Else, render the component that was passed to this higher-order component
    }
  }

  const mapStateToProps = state => {
    return {
      // authenticated: state.auth.authenticated,
    };
  };

  return connect(mapStateToProps)(RequireAuthentication);
};
