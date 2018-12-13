import React from 'react';
import ReactDOM from 'react-dom';
import './App/Config/ReactotronConfig'
import './index.css';
import './animations.css'
import Root from './App/Containers/AppRoot';
import {register} from './registerServiceWorker';

ReactDOM.render(
  <Root />,
  document.getElementById('root')
);

register();