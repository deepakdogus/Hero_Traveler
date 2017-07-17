import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import Feed from './App/Containers/Feed';
// import SignupTopics from './App/Containers/Signup/SignupTopics';
import SignupSocial from './App/Containers/Signup/SignupSocial';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<SignupSocial />, document.getElementById('root'));
registerServiceWorker();
