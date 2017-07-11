import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App.js';
import Feed from './App/Containers/Feed';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Feed />, document.getElementById('root'));
registerServiceWorker();
